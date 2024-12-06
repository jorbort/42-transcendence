from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny


@api_view(['POST'])
@permission_classes([AllowAny])
def refreshTokens(request):
	refresh_token = request.data.get('refresh_token')

	if refresh_token is None:
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
