# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .Recommendation import give_rec
import json
from django.db import models
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@api_view(['GET'])
def get_all_destinations(request):
    print("Request received")  # Add print statements for debugging
    destinations = Place_Data.objects.all()
    serializer = PlaceDataSerializer(destinations, many=True)
    return Response({'destinations': serializer.data})

@api_view(['GET'])
def get_recommendations(request, place_name):
    try:
        # Get recommendations for the given place
        recommendations = give_rec(place_name)
        
        # Fetch details of each recommendation from the database
        recommended_places_data = []
        for recommendation in recommendations:
            place_data = Place_Data.objects.filter(Name=recommendation).first()
            if place_data:
                serializer = PlaceDataSerializer(place_data)
                recommended_places_data.append(serializer.data)
        
        return Response({'recommendations': recommended_places_data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def add_place(request):
    if request.method == 'GET':
        # Here you would handle the POST request data and save it to the database
        # Example:
        place_name = request.POST.get('name')
        # Save other place details to the database
        
        # Dummy response for now
        return JsonResponse({'message': 'Place added successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@api_view(['GET'])
def get_place_details(request, place_name):
    try:
        place = Place_Data.objects.get(Name=place_name)
        serializer = PlaceDataSerializer(place)
        return Response({'place': serializer.data})
    except Place_Data.DoesNotExist:
        return Response({'error': 'Place not found'}, status=404)
    

@api_view(['GET'])
def get_destinations_sorted_by_likes(request):
    try:
        destinations = Place_Data.objects.order_by('-Likes')[:10]  # Sort destinations by Likes in descending order and limit to 10
        serializer = PlaceDataSerializer(destinations, many=True)
        return Response({'destinations': serializer.data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_places_by_category(request, category):
    if request.method == 'GET':
        # Query places based on the provided category
        places = Place_Data.objects.filter(Category__icontains=category)
        
        # Serialize the places data
        serialized_places = []
        serialized_places = PlaceDataSerializer(places, many=True)
        return Response({'places': serialized_places.data})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405) 

@api_view(['POST'])
def get_searched_places(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('SearchedPlace', '')

        matching_places = Place_Data.objects.filter(
            models.Q(Name__icontains=user_input) |
            models.Q(Category__icontains=user_input) |
            models.Q(City__icontains=user_input) |
            models.Q(State__icontains=user_input) |
            models.Q(Activities__icontains=user_input) |
            models.Q(Amenities__icontains=user_input)
        )

        print(matching_places)
        for place in matching_places:
            print("Place Data - Name:", place.Name)
        if matching_places.exists():
            serializer = PlaceDataSerializer(matching_places, many=True)
            serialized_data = serializer.data
            return Response({'matching_places': serialized_data})
        else:
            return JsonResponse({'message': 'No matching places found'}, status=404, safe=False)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({'error': str(e)}, safe=False)
    
@api_view(["POST"])
def delete_place(request):
    if request.method == 'POST':
        try:
            # Get Place_id or Name from the request data
            data = json.loads(request.body)
            place_name = data.get('Name')

            # Use either Place_id or Name to identify the document to be deleted
            if place_name:
                place_data = Place_Data.objects.get(Name=place_name)
            else:
                return JsonResponse({'error': 'Place_id or Name not provided'}, status=400)
            print("after place data and value is: ",place_data)

            # Delete the document
            place_data.delete()
            return JsonResponse({'message': 'Place deleted successfully'}, status=200)
        except Place_Data.DoesNotExist:
            return JsonResponse({'error': 'Place not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['POST'])
def get_bookmarked_places(request):
    try:
        data = json.loads(request.body)
        bookmarked_places_ids = data.get('BookmarkedPlaces', [])
        # Convert Place_id values to integers for querying
        bookmarked_places_ids = [int(place_id) for place_id in bookmarked_places_ids]

        # Query places with matching Place_id
        bookmarked_places = Place_Data.objects.filter(Place_id__in=bookmarked_places_ids)
        serializer = PlaceDataSerializer(bookmarked_places, many=True)
        return Response({'bookmarked_places': serializer.data})
    except Exception as e:
        return JsonResponse({'error': str(e)})
    

@api_view(['GET'])
def get_paginated_destinations(request):
    destinations = Place_Data.objects.all()
    paginator = Paginator(destinations, 5)  # 5 items per page
    page = request.GET.get('page')
    try:
        paginated_destinations = paginator.page(page)
    except PageNotAnInteger:
        paginated_destinations = paginator.page(1)
    except EmptyPage:
        paginated_destinations = paginator.page(paginator.num_pages)
    
    serializer = PlaceDataSerializer(paginated_destinations, many=True)
    return Response({'destinations': serializer.data})