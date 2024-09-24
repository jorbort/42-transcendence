from rest_framework import serializers
from .models import PongUser , MatchHistory, Friendship

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
		if PongUser.objects.filter(email=attrs['email']).exists():
			raise serializers.ValidationError({
				"email": "A user with this email already exists."
			})
		return attrs
	
class MatcHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = MatchHistory
		fields = '__all__'

class FrienshipSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friendship
		field = ['user1','user2']