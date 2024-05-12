import random
import string
import datetime

from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    identification = serializers.CharField(required=True, max_length=30)
    password = serializers.CharField(required=True)
    name = serializers.CharField(required=True, max_length=100)

    def validate(self, data):
        if User.objects.filter(identification=data['identification']).exists():
            raise serializers.ValidationError({"identification": ["This identification already exists"]})

        if len(data['password']) < 10:
            raise serializers.ValidationError({"password": ["Password must be at least 10 characters"]})

        return data

    def create(self, validated_data):
        user = User.objects.create(
            identification=validated_data['identification'],
            name=validated_data['name'],
            password=make_password(validated_data['password'])
        )
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['identification', 'password', 'token', 'token_created_at', 'token_valid']

    identification = serializers.CharField(required=True, max_length=30)
    password = serializers.CharField(required=True)

    def validate(self, data):
        if not User.objects.filter(identification=data['identification']).exists():
            raise serializers.ValidationError({"identification": ["This identification does not exist"]})

        user = User.objects.get(identification=data['identification'])

        if user.password != make_password(data['password'], salt=user.password.split('$')[2]):
            raise serializers.ValidationError({"password": ["Password is incorrect"]})

        token = ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(32))
        return {'identification': data['identification'], 'token': token}

    def update(self, user, token):
        user.token = token['token']
        user.token_created_at = datetime.timestamp(datetime.now())
        user.token_valid = 1
        user.save()
        return user
