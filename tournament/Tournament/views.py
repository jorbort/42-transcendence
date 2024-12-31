from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import tournament
from .serializers import TournamentSerializer

class TournamentListCreateView(APIView):
    # Requiere que el usuario esté autenticado
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        tournaments = tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

