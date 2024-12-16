from django.shortcuts import render
import logging
import random
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from users.models import PongUser , Friendship
from users.serializer import UserSerializer, FrienshipSerializer, AvatarUploadSerializer, UpdateUserSerializer

logging.basicConfig(level=logging.DEBUG)

def generate_random_digits(n=6):
	return "".join(map(str, random.sample(range(0, 10), n)))

# Create your views here.
def hello_world(request):
	return render(request,'index.html',{})

@api_view(['GET'])
@permission_classes([AllowAny])
def getUsers(request):
	users=PongUser.objects.all()
	serializer=UserSerializer(users,many=True)
	return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
	logging.info("AQUI NO LLEGA 0")
	logging.info(request)
	logging.info(request.POST.get('name'))
	logging.info("AQUI NO LLEGA 1")
	logging.info(request.POST.get('last_name'))
	logging.info("AQUI NO LLEGA 2")
	logging.info(request.POST.get('img'))
	user = request.user

	try:
		user.first_name = request.POST.get('name')
		user.last_name = request.POST.get('name')
		user.fortytwo_image_url = request.POST.get('img')
		user.save()
		return Response({'status': 'Ok'}, status=200)
	except Exception as e:
		logging.info(str(e))
		return Response({'error': 'Bad request'}, status=400)
	return Response({'error': 'Bad request'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friend(request):
	current_username = request.user.username
	friend_username = request.data.get('friend_username')

	if not friend_username:
		return Response({'error': 'Friend username is required.'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		current_user = PongUser.objects.get(username=current_username)
		friend_user = PongUser.objects.get(username=friend_username)
		if current_user == friend_user:
			return Response({'error': 'User and friend must be different users'}, status=status.HTTP_400_BAD_REQUEST)
	except PongUser.DoesNotExist:
		return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

	if Friendship.objects.filter(user1=current_user, user2=friend_user).exists() or \
		Friendship.objects.filter(user1=friend_user, user2=current_user).exists():
		return Response({'error': 'Friendship already exists.'}, status=status.HTTP_400_BAD_REQUEST)

	data = {
		'user1': current_user.username,
		'user2': friend_user.username
	}
	serializer = FrienshipSerializer(data=data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	logging.info(serializer.errors)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    username = request.query_params.get('username')
    try:
        user = PongUser.objects.get(username=username)
    except PongUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    friendships = Friendship.objects.filter(user1=user) | Friendship.objects.filter(user2=user)
    serializer = FrienshipSerializer(friendships, many=True)
    return Response(serializer.data)