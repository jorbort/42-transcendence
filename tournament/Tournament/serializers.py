# from rest_framework import serializers
# from .models import Tournament, MatchHistory, PongUser

# class MatchHistorySerializer(serializers.ModelSerializer):
#     player1 = serializers.CharField()
#     player2 = serializers.CharField()
#     winner = serializers.CharField()

#     class Meta:
#         model = MatchHistory
#         fields = ['player1', 'player2', 'player1_score', 'player2_score', 'winner', 'tournament_id']

# class TournamentSerializer(serializers.ModelSerializer):
#     rounds = serializers.ListField(child=serializers.ListField(child=MatchHistorySerializer()))
#     players = serializers.ListField(child=serializers.CharField())

#     class Meta:
#         model = Tournament
#         fields = ['name', 'date', 'players', 'rounds', 'winner']

#     def create(self, validated_data):
#         rounds_data = validated_data.pop('rounds', [])
#         players = validated_data.pop('players', [])

#         # Crear el torneo
#         tournament = Tournament.objects.create(
#             name=validated_data['name'],
#             date=validated_data['date'],
#             players=players,  # Guardar los nombres directamente en el JSONField
#             rounds=rounds_data,
#             winner=validated_data.get('winner')
#         )

#         # Crear los partidos en MatchHistory
#         for round_data in rounds_data:
#             for match_data in round_data:
#                 # Validar existencia de jugadores en la base de datos (si no existe, usar solo su nombre)
#                 player1_name = match_data['player1']
#                 player2_name = match_data['player2']
#                 winner_name = match_data['winner']

#                 player1 = PongUser.objects.filter(username=player1_name).first()
#                 player2 = PongUser.objects.filter(username=player2_name).first()
#                 winner = PongUser.objects.filter(username=winner_name).first()

#         #         # Guardar los datos en MatchHistory
#                 MatchHistory.objects.create(
#                     player1=player1 if player1 else None,
#                     player2=player2 if player2 else None,
#                     player1_score=match_data['player1_score'],
#                     player2_score=match_data['player2_score'],
#                     winner=winner if winner else None,
#                     tournament_id=tournament
#                 )

#         return tournament

# class TournamentSerializer(serializers.ModelSerializer):
#         class Meta:
#            model = Tournament
#            fields = ['name', 'date', 'players', 'rounds', 'winner']
from rest_framework import serializers
from .models import Tournament, MatchHistory, PongUser

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
        model = Tournament
        fields = ['name', 'date', 'players', 'rounds', 'winner']

    def create(self, validated_data):
        rounds_data = validated_data.pop('rounds', [])
        players = validated_data.pop('players', [])

        # Crear el torneo
        tournament = Tournament.objects.create(
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
                    tournament_id=tournament
                )

        return tournament
