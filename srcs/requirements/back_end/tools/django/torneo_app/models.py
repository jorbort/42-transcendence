from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Match(models.Model):
    player_1 = models.ForeignKey(Player, related_name='matches_as_player_1', on_delete=models.CASCADE)
    player_2 = models.ForeignKey(Player, related_name='matches_as_player_2', on_delete=models.CASCADE)
    winner = models.ForeignKey(Player, related_name='won_matches', null=True, blank=True, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_1} vs {self.player_2}"
