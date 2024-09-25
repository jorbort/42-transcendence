from rest_framework import serializers
from .models import PongUser , MatchHistory, Friendship

class UserSerializer(serializers.ModelSerializer):
	password2= serializers.CharField(style={'input_type': 'pasword'}, write_only = True)
	avatar_url = serializers.SerializerMethodField()
	class Meta:
		model=PongUser
		fields=['username', 'email', 'password','password2', 'otp', 'otp_expiry_time', 'online_status', 'avatar_url']
	
	def get_avatar_url(self,obj):
		request = self.context.get('request')
		if obj.avatar and request:
			return request.build_absolute_uri(obj.avatar.url)
		return None

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

class UpdateUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongUser
		fields = ['email', 'password', 'avatar']
		extra_kwargs = {
			'password': {'write_only': True}
		}

	def update(self,instance, validated_data):
		if 'password' in validated_data:
			instance.set_password(validated_data['password'])
			validated_data.pop('password')
		return super().update(instance, validated_data)
class MatcHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = MatchHistory
		fields = '__all__'

class FrienshipSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friendship
		field = ['user1','user2']

class AvatarUploadSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongUser
		fields = ['avatar']