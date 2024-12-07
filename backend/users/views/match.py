from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import MatchHistory
from users.serializer import MatcHistorySerializer


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def record_match(request):
	if request.user.is_authenticated:
		serializer= MatcHistorySerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response({'detail': 'authentication credential where not provided'})
