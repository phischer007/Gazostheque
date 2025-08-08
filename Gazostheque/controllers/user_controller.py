from Gazostheque.controllers.owner_controller import get_owner_by_user

from django.db import connection
from django.db.models import Count
from django.db.models.functions import ExtractYear
from django.contrib.auth import get_user_model

def get_formatted_user(user):
    """
    This function takes a user object as input and returns a dictionary 
    containing the user's details. If the user has an associated owner, 
    the owner's details are also included in the dictionary.
    
    Args:
        user (obj): A user object.
    
    Returns:
        user_details (dict): A dictionary containing the user's details.
    """
    # Get the owner object associated with the user
    owner = get_owner_by_user(user.user_id)
    
    # Initialize a dictionary to store the user's details
    user_details = {
        "user_id": user.user_id,
        "last_name": user.last_name,
        "first_name": user.first_name,
        "role": user.role,
        "is_active": user.is_active,
        "is_staff": user.is_staff,
        "email": user.email,
        "profil_pic": user.profil_pic
    }

    # If the user has an associated owner, add the owner's details to the dictionary
    if owner :
        user_details["owner_id"] = owner.owner_id
        user_details["owner_contact"] = owner.contact
    
    return user_details

# def get_user_stats():
#     """
#     Retrieves user statistics grouped by year of registration and role.
#     Returns a list of dictionaries containing year, role, and user count.
#     """
#     User = get_user_model()
    
#     # Using Django ORM to avoid raw SQL
#     queryset = User.objects.exclude(email='admin@example.com').annotate(
#         year=ExtractYear('date_joined')
#     ).values('year', 'role').annotate(
#         user_count=Count('user_id')
#     ).order_by('year')
    
#     return list(queryset)