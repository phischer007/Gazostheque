import  base64, json
import os
from django.db.models import Count, F
from django.utils.timezone import now
from django.conf import settings
from django.shortcuts import render
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required

from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from Gazostheque.models.material_model import Materials
from Gazostheque.serializers import MaterialSerializer
from Gazostheque.controllers.materials_controller import *

from django.db.models.functions import ExtractYear

############################################################################## 

@login_required
@api_view(['GET'])
def get_materials(request):
    materials = Materials.objects.all()
    
    selected_inventory = materials.values(
        'material_id',
        'material_title',
        'team',
        'origin',
        'size',
        'date_arrivee',
        'date_depart',
        owner_first_name=F('owner__user__first_name'),
        owner_last_name=F('owner__user__last_name'),
        owner_email=F('owner__user__email'),
        owner_profil=F('owner__user__profil_pic')
    )
    return JsonResponse(list(selected_inventory), safe=False)

@login_required
@api_view(['GET'])
def get_materials_by_tag(request, tag):
    materials = Materials.objects.filter(tags__name__in=[tag])
    serializer = MaterialSerializer(materials, many=True)
    return JsonResponse(serializer.data, safe=False)

@login_required
@api_view(['POST'])
def create_material(request):
    if request.method == 'POST':
       return on_create_material(request)


@api_view(['GET', 'PUT', 'DELETE'])
def material_detail(request, pk):
    """
    Retrieve, update or delete a material instance.
    """
    try: 
        material = get_material(pk)
    except Materials.DoesNotExist: 
        return JsonResponse({'message': 'The material does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    if request.method == 'GET': 
        try:
            details_data = get_detailed_material(pk)
            return JsonResponse(details_data)
        except Exception as e:
            return JsonResponse({'message': 'Error fetching material details!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'PUT': 
        # Check if user is admin or owner
        user = request.user
        is_admin = user.is_staff or user.role == 'admin'
        is_owner = material.owner.user_id == user.user_id
        if not (is_admin or is_owner):
            return JsonResponse({'message': 'You do not have permission to edit this material'}, status=status.HTTP_403_FORBIDDEN)
        
        material_data = request.data 
        material_serializer = MaterialSerializer(material, data=material_data, partial=True)
        
        if material_serializer.is_valid():
            material_serializer.save()
            return JsonResponse(material_serializer.data)
        print(material_serializer.errors)
        return JsonResponse(material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE': 
        # Check if user is admin or owner
        user = request.user
        is_admin = user.is_staff or user.role == 'admin'
        is_owner = material.owner.user_id == user.user_id
        
        if not (is_admin or is_owner):
            return JsonResponse({'message': 'You do not have permission to delete this material'},status=status.HTTP_403_FORBIDDEN)
            
        material.delete()
        return JsonResponse({'message': 'Material was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
   
@login_required
@api_view(['GET'])
def material_list_per_owner(request, pk):
    materials = Materials.objects.filter(owner=pk)
        
    if request.method == 'GET': 
        materials_serializer = MaterialSerializer(materials, many=True)
        return JsonResponse(materials_serializer.data, safe=False)

@login_required 
@api_view(['GET'])
def latest_material(request):
    if Materials.objects.exists():
        materials = Materials.objects.order_by('-created_at')[:4]
    else:
        materials = []
        
    if request.method == 'GET': 
        materials_serializer = MaterialSerializer(materials, many=True)
        return JsonResponse(materials_serializer.data, safe=False)

@api_view(['GET'])
def material_events_detail(request, pk):
    events =  get_events_detail(pk)
    return JsonResponse(events, safe=False)

@api_view(['GET'])
def material_events_lite(request, pk):
    events =  get_events_detail_lite(pk)
    return JsonResponse(events, safe=False)


@login_required
@api_view(['GET'])
def get_total_count(request):
    # Total materials count
    materials_count = Materials.objects.count()
    
    # Current month/year for monthly comparison
    current_month = now().month
    current_year = now().year
    
    # Materials added this month
    materials_added_this_month = Materials.objects.filter(
        created_at__month=current_month,
        created_at__year=current_year
    ).count()
    
    # Materials added last month
    last_month = current_month - 1 if current_month > 1 else 12
    last_month_year = current_year if current_month > 1 else current_year - 1
    materials_added_last_month = Materials.objects.filter(
        created_at__month=last_month,
        created_at__year=last_month_year
    ).count()
    
    # Calculate percentage difference
    if materials_added_last_month > 0:
        percentage_diff = ((materials_added_this_month - materials_added_last_month) / 
                         materials_added_last_month) * 100
    else:
        percentage_diff = 0
    
    return JsonResponse({
        'total_count': materials_count,
        'current_month_count': materials_added_this_month,
        'percentage_diff': round(percentage_diff, 1),
        'is_positive': percentage_diff >= 0
    })

@login_required
@api_view(['GET'])
def get_materials_by_lab(request):
    # Get count of materials for each lab
    liphy_count = Materials.objects.filter(lab_destination='LIPhy').count()
    ige_count = Materials.objects.filter(lab_destination='IGE').count()
    
    return JsonResponse({
        'LIPhy': liphy_count,
        'IGE': ige_count
    })

@login_required
@api_view(['GET'])
def get_materials_by_year_and_lab(request):
    """
    Get material counts grouped by year and lab destination
    Returns data in format suitable for ApexCharts
    """
    materials = Materials.objects.annotate(
        year=ExtractYear('created_at')
    ).values('year', 'lab_destination').annotate(
        count=Count('material_id')
    ).order_by('year', 'lab_destination')
    
    # Transform data into format suitable for ApexCharts
    years = sorted(set(item['year'] for item in materials))
    labs = sorted(set(item['lab_destination'] for item in materials if item['lab_destination']))
    
    result = {
        'years': years,
        'series': []
    }
    
    # Initialize series data structure
    series = []
    for lab in labs:
        lab_data = {
            'name': lab,
            'data': []
        }
        for year in years:
            # Find count for this lab/year combination
            count = next(
                (item['count'] for item in materials 
                 if item['year'] == year and item['lab_destination'] == lab),
                0
            )
            lab_data['data'].append(count)
        series.append(lab_data)
    
    return JsonResponse(result, safe=False)