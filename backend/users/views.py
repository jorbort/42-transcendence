from django.shortcuts import render
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
	if 'password' in data:
		data['password'] = make_password(data['password'])
		pass_length= len(data['password'])
	serializer = UserSerializer(data=data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data)
	else:
		return Response({
			'error': 'bad input',
			'password_length' : pass_length,
			'serializer_errors' : serializer.errors
			},status=400)