from django.shortcuts import render
import random 
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate , login as django_login
from django.contrib.auth import logout as django_logout
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PongUser
from .serializer import UserSerializer

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
	user=PongUser.objects.get(id=pk)
	serializer = UserSerializer(user,many=False)
	return Response(serializer.data)

@csrf_exempt
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
	

class LoginView(generics.GenericAPIView):

	def post(self,request):
		username = request.data.get('username')
		password = request.data.get('password')

		user = authenticate(request, username=username, password=password)

		if user is not None:
			verification_code = random.randint(100000,999999)
			user.otp = verification_code
			user.otp_expiry_time = timezone.now() + timedelta(hours=1)
			user.save()

			send_mail(
				'Verifivation Code for Pong',
				f'Your verification code is: {verification_code}',
				'42pong1992@gmail.com',
				[user.email],
				fail_silently=False,
			)
			return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
		return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def OtpVerify(request):
	username= request.data.get('username')
	password = request.data.get('password')
	otp = request.data.get('otp')

	user = authenticate(request, username=username, password=password)

	if user is not None:
		if (
			user.otp == otp and
			user.otp_expiry_time is not None and
			user.otp_expiry_time > timezone.now()
		):
			django_login(request,user)
			##generate JWT tokens
			refresh_token = RefreshToken.for_user(user)
			access_token = str(refresh_token.access_token)

			## reset otp
			user.otp = ''
			user.otp_expiry_time = None
			user.save()
			response = Response({'access_token': access_token, 'refresh_token': str(refresh_token)}, status=status.HTTP_200_OK)
			response.set_cookie('access_token', access_token)
			response.set_cookie('refresh_token', str(refresh_token))
			return response
	return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_view(request):
    # Log the user out
	django_logout(request)
	# Clear the authentication cookies
	response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
	response.delete_cookie('access_token')
	response.delete_cookie('refresh_token')
	response.delete_cookie('csrftoken')
	
	return response