from django.shortcuts import render
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PongUser
from .serializer import UserSerializer

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
	user=PongUser.objects.get(id=pk)
	serializer = UserSerializer(user,many=False)
	return Response(serializer.data)

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