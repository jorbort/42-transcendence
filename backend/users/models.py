from django.db import models
from django.contrib.auth.models import AbstractUser

class PongUser(AbstractUser):
	email= models.EmailField(max_length=50)
	password = models.CharField(max_length=250)
	password2=models.CharField(max_length=250,default='vivaPacman')
	otp = models.CharField(max_length=6, blank=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)
	online_status=models.BooleanField(default=False)
	avatar= models.ImageField(upload_to='images/',blank=True,null=True)
	fortytwo_image_url = models.URLField(max_length=500000, blank=True, null=True) 


class Friendship(models.Model):
	user1=models.ForeignKey(PongUser, related_name='friendship_user1', on_delete=models.CASCADE)
	user2=models.ForeignKey(PongUser, related_name='friendship_user2', on_delete=models.CASCADE)

	class Meta:
		unique_together=['user1','user2']

class tournament(models.Model):
	number_of_players = models.PositiveIntegerField(default=4)
	custom_one = models.BooleanField(default=False)
	custom_two = models.BooleanField(default=False)
	custom_three = models.BooleanField(default=False)
	custom_is_saved = models.BooleanField(default=False)
	winner = models.CharField(blank=True, null=True)
class MatchHistory(models.Model):
	player1=models.ForeignKey(PongUser, related_name='match_as_player1', on_delete=models.CASCADE)
	player2=models.ForeignKey(PongUser,related_name='match_as_player2',on_delete=models.CASCADE)
	date= models.DateTimeField(auto_now_add=True)
	player1_score = models.IntegerField()
	player2_score=models.IntegerField()
	winner=models.ForeignKey(PongUser, related_name='matches_won', on_delete=models.CASCADE)
	tournament_id = models.ForeignKey(tournament, related_name='tournament_id', on_delete=models.CASCADE, null=True)

	def __str__(self):
		return f"Match on {self.date} between {self.player1.username} and {self.player2.username}"



