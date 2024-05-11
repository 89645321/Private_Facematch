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
            raise serializers.ValidationError("This identification already exists")

        if len(data['password']) < 10:
            raise serializers.ValidationError("Password must be at least 10 characters")

        return data

    def create(self, validated_data):
        user = User.objects.create(
            identification=validated_data['identification'],
            name=validated_data['name'],
            password=make_password(validated_data['password'])
        )
        return user
