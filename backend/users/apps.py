from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class UsersConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'users'
    
	def ready(self):
		import users.signals
