# File that links the api endpoint to their designated url path
from django.urls import path 

from Gazostheque.views import user_views
from Gazostheque.views import owner_views
from Gazostheque.views import material_views
from Gazostheque.views import notification_views

urlpatterns = [
    # Endpoint for adding new bottle / cylinder
    path('materials/create/', material_views.create_material),
    path('materials/', material_views.get_materials),
    path('materials/<int:pk>/', material_views.material_detail),
    path('materials/owner/<int:pk>/', material_views.material_list_per_owner),

    path('materials/latest/', material_views.latest_material),
    path('material/<int:pk>/events/', material_views.material_events_detail),
    path('material/<int:pk>/events/lite/', material_views.material_events_lite),
    path('materials/count/', material_views.get_total_count),

    path('materials/count-by-lab', material_views.get_materials_by_lab),
    path('materials/bar-chart', material_views.get_materials_by_year_and_lab),

    # path('materials/tags', material_views.get_tag_suggestions),
    path('materials/tags', material_views.get_all_tags),
    path('materials/search-by-tags', material_views.search_by_tags),

    path('owners/', owner_views.owner_list),
    path('owners/<int:pk>/', owner_views.owner_detail),
    path('active_owners/lite/', owner_views.active_owners_lite),

    path('users/', user_views.user_list),
    path('users/<int:pk>/', user_views.user_detail),
    path('users/upload_pictures/<int:pk>/', user_views.upload_profile_pic),

    path('notifications/', notification_views.notification_operations),
    path('notifications/<int:pk>/', notification_views.user_notification_list),
    path('notifications/important/<int:pk>/', notification_views.user_important_notification_list),

    path('cas/login/', user_views.cas_login, name='cas_ng_login'),
    path('cas/validate/', user_views.cas_validate, name='cas_validate'),
    path('cas/logout/', user_views.cas_logout, name='cas_logout'),
    path('session/', user_views.session_data, name='session_data'), 
]
