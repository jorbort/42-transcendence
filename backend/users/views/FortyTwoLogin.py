import random
import string
import requests
import logging
from django.conf import settings
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as django_login
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import PongUser
from users.serializer import UserSerializer

logging.basicConfig(level=logging.DEBUG)

def gen_state():
	return ''.join(random.choices(string.ascii_letters + string.digits, k=16))

@api_view(['GET'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
		logging.debug(str(e))
		return Response({'detail': f'Failed to obtain access token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
	
	access_token = token_json['access_token']
	user_info_url = "https://api.intra.42.fr/v2/me"
	headers = {'Authorization': f'Bearer {access_token}'}
	user_info_response = requests.get(user_info_url, headers=headers)
	user_info = user_info_response.json()
	salt_string = get_random_string(length=16)
	user_data = {
		'username': user_info['login'],
		'mail': user_info['email'],
		'password' : make_password('vivapacman',salt=salt_string),
		'password2' : make_password('vivapacman',salt=salt_string),
		'fortytwo_image_url' : user_info['image']['link']
    }
	try:
		user = PongUser.objects.get(username=user_info['login'])
		django_login(request, user)
		logging.info(user.fortytwo_image_url)
		refresh_token = RefreshToken.for_user(user)
		access_token = str(refresh_token.access_token)
		ressponse = Response( {'access_token': access_token,
			'refresh_token': str(refresh_token),
			'username' : user_info['login'],
			'user_img' : user.fortytwo_image_url,
			'name' : user.first_name,
			'last_name' : user.last_name,
		},
		status=status.HTTP_200_OK
		)
		return ressponse
	except PongUser.DoesNotExist:
		serializer = UserSerializer(data=user_data)
		if serializer.is_valid():
			user = serializer.save()
		else:
			logging.error(serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		
	django_login(request, user)

	refresh_token = RefreshToken.for_user(user)
	access_token = str(refresh_token.access_token)

	# Esto devuelve simpre lo que hay en la intra por lo tanto no se muestran los 
	# cambios guardados en la base de datos en caso de hacer log in con intra
	response = Response({'access_token': access_token,
		'refresh_token': str(refresh_token),
		'user_img' : user_info['image']['link'],
		'username' : user_info['login'],
		'name' : user_info['first_name'],
		'last_name' : user_info['last_name'],
		'mail' : user_info['email'],
		},
		status=status.HTTP_200_OK)
	response.set_cookie('access_token', access_token)
	response.set_cookie('refresh_token', str(refresh_token))
	return response