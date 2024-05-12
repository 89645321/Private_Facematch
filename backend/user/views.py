from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from datetime import datetime
from .serializers import SignupSerializer
from .serializers import LoginSerializer
from .models import User


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data
        user = User.objects.get(identification=serializer.validated_data['identification'])
        serializer.update(user, token)
        return Response(token, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def userinfo(request):
    token = request.query_params.get('token')
    if not token:
        return Response({"token": ["Token is missing"]}, status=status.HTTP_400_BAD_REQUEST)

    if not User.objects.filter(token=token).exists():
        return Response({"token": ["Invalid token"]}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.get(token=token)

    if user.token_valid == 0:
        return Response({"token": ["This token is expired"]}, status=status.HTTP_401_UNAUTHORIZED)

    if user.token_created_at + 86400 < datetime.timestamp(datetime.now()):
        user.token_valid = 0
        user.save()
        return Response({"token": ["This token is expired"]}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(
        {"name": user.name, "bank": user.bank, "account": user.account, "balance": user.balance},
        status=status.HTTP_200_OK
    )

