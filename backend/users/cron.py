import logging
from django.utils import timezone
from .models import PongUser

logger = logging.getLogger(__name__)

	
def do():
	expired_users = PongUser.objects.filter(
		otp_expiry_time__lt=timezone.now(),
           otp__isnull=False
       )
	# expired_users.update(otp='', otp_expiry_time=None)
	# logger.info(f"Reset OTP for {expired_users.count()} users")
		 # Log the number of expired users found
	logger.debug(f"Found {expired_users.count()} users with expired OTPs")
       
       # Log the expired users' details
	for user in expired_users:
		logger.debug(f"User {user.id}: OTP={user.otp}, Expiry={user.otp_expiry_time}")
       
       # Perform the update
	updated_count = expired_users.update(otp='', otp_expiry_time=None)
       
       # Log the number of users updated
	logger.info(f"Reset OTP for {updated_count} users")