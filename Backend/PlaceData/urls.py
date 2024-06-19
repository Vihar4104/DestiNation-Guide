# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/destinations/', views.get_all_destinations, name='get_all_destinations'),
    path('api/places/<str:place_name>/', views.get_place_details, name='get_place_details'),
    path('api/places/add/', views.add_place, name='add_place'),
    path('api/recommendations/<str:place_name>/', views.get_recommendations, name='get_recommendations'),
    path('api/destinations/sorted-by-likes/', views.get_destinations_sorted_by_likes, name='get_destinations_sorted_by_likes'),
    
    path('api/places/category/<str:category>/', views.get_places_by_category, name='get_places_by_category'),
    
    # path('api/get_bookmarked_places', views.get_bookmarked_places, name='get_bookmarked_places')
]
