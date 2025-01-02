import logging
from django.utils import timezone
from .models import PongUser

logger = logging.getLogger(__name__)

	
def do():
	expired_users = PongUser.objects.filter(
		otp_expiry_time__lt=timezone.now(),
           otp__isnull=False
       )
       
	for user in expired_users:
		logger.info(f"User {user.id}: OTP={user.otp}, Expiry={user.otp_expiry_time}")
       
	updated_count = expired_users.update(otp='', otp_expiry_time=None)
       
	logger.info(f"Reset OTP for {updated_count} users")