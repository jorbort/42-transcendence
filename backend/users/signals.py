from .models import PongUser
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def create_IA(sender, **kwargs):
	if not PongUser.objects.filter(username='IA').exists():
		PongUser.objects.create(username='IA', password="Iapassword", email="ia@gmail.com")
	if not PongUser.objects.filter(username="localhost").exists():
		PongUser.objects.create(username="localhost", password="localPassword", email="localemail@gmail.com")