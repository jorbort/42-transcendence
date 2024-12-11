from users.models import PongUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from users.serializer import UserSerializer, FriendshipSerializer, AvatarUploadSerializer, UpdateUserSerializer

def create_single_user(username, alias):
    print("Llegas")
    user, created = Users.objects.get_or_create(
        username=username,
        alias=alias,
        img=""
    )
    if created:
        user.save()
        print(f"Usuario creado: {username}")
    else:
        print(f"Usuario ya existe: {username}")

create_single_user("localuser", "don_pepito")
create_single_user("IA", "The_IA")


