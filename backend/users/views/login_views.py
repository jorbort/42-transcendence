import random
import logging
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

class LoginView(generics.GenericAPIView):
	permission_classes = [AllowAny]

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
			request.session['username'] = username
			request.session.save()
			return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
		return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
	

@api_view(['POST'])
@permission_classes([AllowAny])
def OtpVerify(request):
	username= request.data.get('username')
	password= request.data.get('password')
	otp = request.data.get('otp')

	user = authenticate(request, username=username, password=password)

	
	if user is not None:
		if (
			user.otp == otp and
			user.otp_expiry_time is not None and
			user.otp_expiry_time > timezone.now()
		):
			django_login(request,user)
			refresh_token = RefreshToken.for_user(user)
			access_token = str(refresh_token.access_token)

			user.otp = ''
			user.otp_expiry_time = None
			user.save()
			response = Response({'access_token': access_token,
						'refresh_token': str(refresh_token),
						'user_img' : user.fortytwo_image_url,
						'first_name' : user.first_name,
						'last_name' : user.last_name,
						}, status=status.HTTP_200_OK)
			return response
	return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):

	django_logout(request)
	response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
	
	return response
