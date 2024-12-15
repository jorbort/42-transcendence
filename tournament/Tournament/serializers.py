from rest_framework import serializers
from .models import Tournament, MatchHistory, PongUser

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = ['player1', 'player2', 'player1_score', 'player2_score', 'winner']

class TournamentSerializer(serializers.ModelSerializer):
    rounds = MatchHistorySerializer(many=True, write_only=True)  # Se usa para procesar las rondas
    players = serializers.ListField(child=serializers.IntegerField(), write_only=True)  # IDs de los jugadores

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'date', 'players', 'rounds', 'winner']

    def create(self, validated_data):
        rounds_data = validated_data.pop('rounds', [])
        players_ids = validated_data.pop('players', [])
        
        # Convertir IDs de jugadores a instancias de PongUser
        players = PongUser.objects.filter(id__in=players_ids)

        # Crear el torneo
        tournament = Tournament.objects.create(**validated_data, players=list(players.values_list('id', flat=True)))

        # Guardar cada ronda en MatchHistory
        for round_data in rounds_data:
            MatchHistory.objects.create(
                player1=round_data['player1'],
                player2=round_data['player2'],
                player1_score=round_data['player1_score'],
                player2_score=round_data['player2_score'],
                winner=round_data['winner'],
                tournament_id=tournament
            )

        return tournament
