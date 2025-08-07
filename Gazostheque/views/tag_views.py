# from django.shortcuts import render
# from django.shortcuts import get_object_or_404
# from django.db.models import Q, F

# from django.http.response import JsonResponse
# from rest_framework.parsers import JSONParser 
# from rest_framework import status
 
# from Gazostheque.models.tag_model import Tags
# from Gazostheque.serializers import TagSerializer
# from rest_framework.decorators import api_view


# @api_view(['GET', 'POST'])
# def tags_operations(request):
#     if request.method == 'GET':
#         try: 
#             tags = Tags.objects.all().order_by('-created_at')
#             tag_serializer = TagSerializer(tags, many=True)
#             serialized_data = tag_serializer.data
#             return JsonResponse(serialized_data, safe=False)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
 
#     elif request.method == 'POST':
#         tag_data = JSONParser().parse(request)
#         # tag_data = request.data
#         tag_serializer = TagSerializer(data=tag_data)
#         if tag_serializer.is_valid():
#             tag_serializer.save()
#             return JsonResponse(tag_serializer.data, status=status.HTTP_201_CREATED) 
#         print(tag_data)
#         print(tag_serializer.errors)
#         return JsonResponse(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT', 'DELETE'])
# def single_tag_operations(request, pk):
#     tag = Tags.objects.filter(pk=pk)
    
#     if request.method == 'PUT': 
#         tag_data = JSONParser().parse(request) 
#         # tag_data = request.data 
#         tag_serializer = TagSerializer(tag, data=tag_data, partial=True) 
#         if tag_serializer.is_valid(): 
#             tag_serializer.save() 
#             return JsonResponse(tag_serializer.data) 
#         return JsonResponse(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
 
#     elif request.method == 'DELETE':
#         try:
#             tag_or_404 = get_object_or_404(Tags, pk=pk)
#             tag_or_404.delete()
#             return JsonResponse({"message": "Tag deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
#         except Exception as e:
#             print("Error deleting tag:", str(e))
#             return JsonResponse({"error": "Failed to delete tag."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 