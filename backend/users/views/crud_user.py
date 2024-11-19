from django.shortcuts import render
import random
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from users.models import PongUser
from users.serializer import UserSerializer, FrienshipSerializer, AvatarUploadSerializer, UpdateUserSerializer


def generate_random_digits(n=6):
	return "".join(map(str, random.sample(range(0, 10), n)))

# Create your views here.
def hello_world(request):
	return render(request,'index.html',{})

@api_view(['GET'])
def getUsers(request):
	users=PongUser.objects.all()
	serializer=UserSerializer(users,many=True)
	return Response(serializer.data)

@api_view(['GET'])
def	getUser(request,pk):
	try:
		user=PongUser.objects.get(id=pk)
	except PongUser.DoesNotExist:
		return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
	serializer = UserSerializer(user, many=False, context={'request':request})
	return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_info(request):
	try:
		user=PongUser.objects.get(id=request.user.id)
	except PongUser.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	
	serializer = UpdateUserSerializer(user, data=request.data, partial=True)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def addUser(request):
	data = request.data.copy()
	salt_string = get_random_string(length=16)
	if 'password' in data:
			data['password'] = make_password(data['password'],salt=salt_string)
	if 'password2' in data:
		data['password2'] = make_password(data['password2'], salt=salt_string)
	serializer = UserSerializer(data=data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data,status=201)
	else:
		return Response({'serializer_errors' : serializer.errors},status=400)
	
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_avatar(request):
	user = request.user
	serializer = AvatarUploadSerializer(instance=user, data=request.data,partial=True)
	
	if serializer.is_valid():
		serializer.save()
		return Response({'detail': 'Avatar uploaded successfully.'}, status=status.HTTP_200_OK)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([isAuthenticated])
def add_friend(request):
	serializer= FrienshipSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classe([isAuthenticated])
def	get_friends(request):
	user = request.user
	friends = Friendship.objects.filter(user1=user) | Friendship.objects.filter(user2=user)
	serializer = FriendshipSerializer(friends, many=True)
	return Response(serializer.data, status=200)