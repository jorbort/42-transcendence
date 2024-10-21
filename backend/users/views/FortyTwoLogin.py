import random
import string
import requests
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as django_login
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import PongUser
from users.serializer import UserSerializer


def gen_state():
	return ''.join(random.choices(string.ascii_letters + string.digits, k=16))

@api_view(['GET'])
def login_42(request):
    state = gen_state()
    authorize_url = (
        "https://api.intra.42.fr/oauth/authorize"
        f"?client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=public"
        f"&state={state}"
    )
    return redirect(authorize_url)

@api_view(['POST'])
def callback_42(request):
	state = request.data.get('state')
	code = request.data.get('code')
	
	token_url = "https://api.intra.42.fr/oauth/token"
	token_data = {
		'grant_type': 'authorization_code',
		'client_id': settings.CLIENT_ID,
		'client_secret': settings.CLIENT_SECRET,
		'code': code,
		'redirect_uri': settings.REDIRECT_URI,
		'state' : state
	}
	
	try:
		token_response = requests.post(token_url, data=token_data)
		token_response.raise_for_status()
		token_json = token_response.json()
	except requests.exceptions.RequestException as e:
		return Response({'detail': f'Failed to obtain access token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
	
	access_token = token_json['access_token']

	user_info_url = "https://api.intra.42.fr/v2/me"
	headers = {'Authorization': f'Bearer {access_token}'}
	user_info_response = requests.get(user_info_url, headers=headers)
	user_info = user_info_response.json()

	user_data = {
		'username': user_info['login'],
		'email': user_info['email'],
		'password' : 'vivapacman',
		'password2' : 'vivapacman',
    }
	try:
		user = PongUser.objects.get(username=user_info['login'])
	except PongUser.DoesNotExist:
		serializer = UserSerializer(data=user_data)
		if serializer.is_valid():
			user = serializer.save()
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		
	django_login(request, user)

	refresh_token = RefreshToken.for_user(user)
	access_token = str(refresh_token.access_token)

	response = Response({'access_token': access_token, 'refresh_token': str(refresh_token)}, status=status.HTTP_200_OK)
	response.set_cookie('access_token', access_token)
	response.set_cookie('refresh_token', str(refresh_token))
	return response

	# frontend_url = f"http://localhost:80/profile?access_token={access_token}&refresh_token={str(refresh_token)}"
	# return redirect(frontend_url)