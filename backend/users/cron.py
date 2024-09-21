from django_cron import CronJobBase, Schedule
from django.utils import timezone
from .models import PongUser

class ResetExpiredOTP(CronJobBase):
	schedule = Schedule(run_every_mins=60)
	code = 'users.cron'

	def do(self):
		PongUser.objects.filter(
			code_expiry_time__lt=timezone.now(),
            otp__isnull=False
        ).update(otp='', otp_expiry_time=None)
