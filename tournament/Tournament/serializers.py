from rest_framework import serializers
from .models import tournament, MatchHistory, PongUser

class MatchHistorySerializer(serializers.ModelSerializer):
    player1 = serializers.CharField()
    player2 = serializers.CharField()
    winner = serializers.CharField()

    class Meta:
        model = MatchHistory
        fields = ['player1', 'player2', 'player1_score', 'player2_score', 'winner', 'tournament_id']


class TournamentSerializer(serializers.ModelSerializer):
    rounds = serializers.ListField(child=serializers.ListField(child=MatchHistorySerializer()))
    players = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = tournament
        fields = ['name', 'date', 'players', 'rounds', 'winner']

    def create(self, validated_data):
        rounds_data = validated_data.pop('rounds', [])
        players = validated_data.pop('players', [])
        # Crear el torneo
        tournament_1 = tournament.objects.create(
            name=validated_data['name'],
            date=validated_data['date'],
            players=players,  # Guardar los nombres directamente en el JSONField
            rounds=rounds_data,
            winner=validated_data.get('winner')
        )
        # Crear los partidos en MatchHistory
        for round_data in rounds_data:
            for match_data in round_data:
                # Crear o recuperar los jugadores
                player1, _ = PongUser.objects.get_or_create(
                    username=match_data['player1'],
                    defaults={
                        "email": f"{match_data['player1']}@example.com",
                        "password": "defaultpassword"
                    }
                )
                player2, _ = PongUser.objects.get_or_create(
                    username=match_data['player2'],
                    defaults={
                        "email": f"{match_data['player2']}@example.com",
                        "password": "defaultpassword"
                    }
                )
                winner, _ = PongUser.objects.get_or_create(
                    username=match_data['winner'],
                    defaults={
                        "email": f"{match_data['winner']}@example.com",
                        "password": "defaultpassword"
                    }
                )
                # Guardar los datos en MatchHistory
                MatchHistory.objects.create(
                    player1=player1,
                    player2=player2,
                    player1_score=match_data['player1_score'],
                    player2_score=match_data['player2_score'],
                    winner=winner,
                    tournament_id=tournament_1
                )
        return tournament_1
