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
	fortytwo_image_url = models.TextField(blank=True, null=True)
	class Meta:
		managed=True
		db_table='users_ponguser' 

class Friendship(models.Model):
	user1=models.ForeignKey(PongUser, related_name='friendship_user1', on_delete=models.CASCADE)
	user2=models.ForeignKey(PongUser, related_name='friendship_user2', on_delete=models.CASCADE)

	class Meta:
		unique_together=['user1','user2']

class tournament(models.Model):
	name = models.CharField(max_length=100)
	date = models.DateTimeField()
	players = models.JSONField()
	rounds = models.JSONField()
	winner = models.CharField(max_length=100, null=True, blank=True)
	def __str__(self):
		return self.name
	class Meta:
		managed=True
		db_table='users_tournament'

class MatchHistory(models.Model):
	player1=models.ForeignKey(PongUser, related_name='match_as_player1', on_delete=models.CASCADE,db_column='player1_name' )
	player2=models.ForeignKey(PongUser,related_name='match_as_player2',on_delete=models.CASCADE,db_column='player2_name')
	date= models.DateTimeField(auto_now_add=True)
	player1_score = models.IntegerField()
	player2_score=models.IntegerField()
	winner=models.ForeignKey(PongUser, related_name='matches_won', on_delete=models.CASCADE,db_column='winner_name')
	tournament_id = models.ForeignKey(tournament, related_name='tournament_id', on_delete=models.CASCADE, null=True)

	def __str__(self):
		return f"Match on {self.date} between {self.player1.username} and {self.player2.username}"
	class Meta:
		managed=True
		db_table='users_matchhistory'



