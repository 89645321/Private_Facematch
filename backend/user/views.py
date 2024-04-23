from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import SignupSerializer
from .models import User


# @api_view(['POST'])
# def login(request):
#     user = userSerializer(data=request.data)
#     if user.is_valid():
#         user.save()
#         return Response(user.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def signup(request):
    user = SignupSerializer(data=request.data)
    if user.is_valid():
        user.save()
        return Response(user.data, status=status.HTTP_201_CREATED)
