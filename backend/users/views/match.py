from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import MatchHistory , PongUser
from users.serializer import MatcHistorySerializer
from django.db.models import Q
import logging


logger = logging.getLogger(__name__)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def match_history(request):
	username = request.query_params.get('username',None)
	if not username:
		return Response({'detail': 'Username parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
	try:
		user = PongUser.objects.get(username=username)
	except PongUser.DoesNotExist:
		return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
	matches = MatchHistory.objects.filter(Q(player1=user) | Q(player2=user))
	serializer = MatcHistorySerializer(matches, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)
	

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_match(request):
		player1_username= request.data.get('player1')
		player2_username=request.data.get('player2')
		winner_username = request.data.get('winner')
		tournament_id = request.data.get('tournament_id')

		try:
			player1 = PongUser.objects.get(username=player1_username)
			player2 = PongUser.objects.get(username=player2_username)
			winner = PongUser.objects.get(username=winner_username)
		except PongUser.DoesNotExist:
			return Response({'detail': 'One or both users not found'}, status=status.HTTP_400_BAD_REQUEST)

		match_data = {
            'player1': player1.id,
            'player2': player2.id,
            'player1_score': request.data.get('player1_score'),
        	'player2_score': request.data.get('player2_score'),
			'winner': winner.id,
        	'tournament_id': tournament_id
        }
		serializer= MatcHistorySerializer(data=match_data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
