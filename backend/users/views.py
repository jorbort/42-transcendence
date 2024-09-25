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
from rest_framework.decorators import api_view , permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated 
from .models import PongUser , MatchHistory ,Friendship
from .serializer import UserSerializer , MatcHistorySerializer, FrienshipSerializer

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

@api_view(['PUT'])
@login_required
def update_user_info(request):
	try:
		user=PongUser.objects.get(id=request.user.id)
	except PongUser.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_Found)
	
	serializer = UserSerializer(user, data=request.data, partial=True)
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

##TO-DO una vista para poder manejar la subida de imagenes por parte del usuario
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def upload_avatar(request):
# 	try:
# 		user_profile = request.user.userprofile
# 	except

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

@api_view(['POST'])
def refreshTokens(request):
	refresh_token = request.data.get('refresh_token')

	if refresh_token in None:
		return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
	
	try:
		refresher = RefreshToken(refresh_token)
		new_access_token = str(refresher.access_token)
		new_refresh_token = str(refresher)

		response = Response({
            'access_token': new_access_token,
            'refresh_token': new_refresh_token
        }, status=status.HTTP_200_OK)
		response.set_cookie('access_token', new_access_token)
		response.set_cookie('refresh_token', new_refresh_token)

		return response
	except TokenError as e:
		return Response({'detail' : 'Invalid refresh token'}, status= status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def match_history(request):
	if request.user.is_authenticated:
		matches_as_player1= MatchHistory.objects.filter(player1=request.user)
		matches_as_player2=MatchHistory.objects.filter(player2=request.user) 
		matches= matches_as_player1 | matches_as_player2
		serializer = MatcHistorySerializer(matches, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		return Response({'detail': 'Authentication credentials were not provided'})

@api_view(['POST'])
def record_match(request):
	if request.user.is_authenticated:
		serializer= MatcHistorySerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response({'detail': 'authentication credential where not provided'})
	
@api_view(['POST'])
def add_friend(request):
	serializer= FrienshipSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)