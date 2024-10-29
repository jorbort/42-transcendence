from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import uuid
# Create your models here.

class PongUser(AbstractUser):
	email= models.EmailField(max_length=50)
	password = models.CharField(max_length=250)
	password2=models.CharField(max_length=250,default='vivaPacman')
	otp = models.CharField(max_length=6, blank=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)
	online_status=models.BooleanField(default=False)
	avatar= models.ImageField(upload_to='images/',blank=True,null=True)


class Friendship(models.Model):
	user1=models.ForeignKey(PongUser, related_name='friendship_user1', on_delete=models.CASCADE)
	user2=models.ForeignKey(PongUser, related_name='friendship_user2', on_delete=models.CASCADE)

	class Meta:
		unique_together=['user1','user2']

class MatchHistory(models.Model):
	player_1 = models.ForeignKey(PongUser, related_name='matches_as_player_1', on_delete=models.CASCADE)
	player_2 = models.ForeignKey(PongUser, related_name='matches_as_player_2', on_delete=models.CASCADE)
	winner = models.ForeignKey(PongUser, related_name='won_matches', null=True, blank=True, on_delete=models.CASCADE)
	date = models.DateTimeField(auto_now_add=True)
	# player1_score = models.IntegerField( null=True, blank=True,)
	# player2_score=models.IntegerField( null=True, blank=True,)

	def __str__(self):
		return f"Match on {self.date} between {self.player_1.username} and {self.player_2.username}"
	
	
# class Match(models.Model):
#     player_1 = models.ForeignKey(PongUser, related_name='matches_as_player_1', on_delete=models.CASCADE)
#     player_2 = models.ForeignKey(PongUser, related_name='matches_as_player_2', on_delete=models.CASCADE)
#     winner = models.ForeignKey(PongUser, related_name='won_matches', null=True, blank=True, on_delete=models.CASCADE)
#     date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.player_1} vs {self.player_2}"
