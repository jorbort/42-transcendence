from rest_framework import serializers
from .models import PongUser

class UserSerializer(serializers.ModelSerializer):
	password2= serializers.CharField(style={'input_type': 'pasword'}, write_only = True)
	class Meta:
		model=PongUser
		fields=['username', 'email', 'password','password2', 'otp', 'otp_expiry_time']
	
	def validate(self,attrs):
		if attrs['password'] != attrs['password2']:
			raise serializers.ValidationError({"password": "Passwords dont match",
									  "password1" : attrs['password'],
									  "password2" : attrs['password2']})
		return attrs