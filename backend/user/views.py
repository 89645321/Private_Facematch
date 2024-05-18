from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from datetime import datetime
from .serializers import SignupSerializer
from .serializers import LoginSerializer
from .models import User
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
import subprocess
import os


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


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['POST'])
def similarity(request):
    import datetime
    log = open('log.txt', 'a')
    logtext = 'request: ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logtext += ', ' + get_client_ip(request) + '\n'
    log.write(logtext)
    log.close()

    if 'face' not in request.FILES:
        return Response({"face": "face ciphertext binary file must be provided"}, status=status.HTTP_400_BAD_REQUEST)
    if 'id_card' not in request.FILES:
        return Response({"id_card": "id card ciphertext binary file must be provided"}, status=status.HTTP_400_BAD_REQUEST)

    face = request.FILES.get('face')
    id_card = request.FILES.get('id_card')

    fs = FileSystemStorage(location='/home/ec2-user/Private_Facematch/server/')

    if fs.exists('face.bin'):
        fs.delete('face.bin')
    if fs.exists('id_card.bin'):
        fs.delete('id_card.bin')
    if os.path.exists('similarity.bin'):
        os.remove('similarity.bin')

    fs.save('face.bin', face)
    fs.save('id_card.bin', id_card)

    executable_path = './server/similarity'
    lib_path = "./server/facematch/"

    env = os.environ.copy()
    env["LD_LIBRARY_PATH"] = lib_path

    try:
        result = subprocess.run(executable_path, capture_output=True, text=True, check=True, env=env)
    except subprocess.CalledProcessError as e:
        return Response({"error": e.stderr}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        os.remove('./server/face.bin')
        os.remove('./server/id_card.bin')

        with open("similarity.bin", "rb") as f:
            similarity_result = f.read()
        os.remove("similarity.bin")

        response = HttpResponse(similarity_result, content_type='application/octet-stream')
        response['Content-Disposition'] = 'attachment; filename=similarity.bin'
        return response

    except Exception as e:
        return Response({"error": e.__str__()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

