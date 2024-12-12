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
	fortytwo_image_url = models.URLField(max_length=200, blank=True, null=True) 

class Tournament(models.Model):
	name = models.CharField(max_length=100)
	date = models.DateTimeField()
	players = models.JSONField()
	rounds = models.JSONField()
	winner = models.CharField(max_length=100, null=True, blank=True)
	def __str__(self):
		return self.name
	class Meta:
		managed=True
		db_table="Tournament"

