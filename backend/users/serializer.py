from rest_framework import serializers
from .models import PongUser , MatchHistory, Friendship

class UserSerializer(serializers.ModelSerializer):
	password2= serializers.CharField(style={'input_type': 'pasword'}, write_only = True)
	avatar_url = serializers.SerializerMethodField()
	fortytwo_image_url = serializers.CharField(required=False, allow_blank=True)
	class Meta:
		model=PongUser
		fields=['username', 'email', 'password','password2', 'otp', 'otp_expiry_time', 'online_status', 'avatar_url', 'fortytwo_image_url']
	
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
	player1_username = serializers.SerializerMethodField()
	player2_username = serializers.SerializerMethodField()
	winner_username = serializers.SerializerMethodField()

	class Meta:
		model = MatchHistory
		fields = ['id', 'date', 'player1_score', 'player2_score', 'player1', 'player2', 'winner', 'tournament_id', 'player1_username', 'player2_username', 'winner_username']

	def get_player1_username(self, obj):
		return obj.player1.username

	def get_player2_username(self, obj):
		return obj.player2.username

	def get_winner_username(self, obj):
		return obj.winner.username

class FriendshipSerializer(serializers.ModelSerializer):
	user1 = serializers.CharField(source='user1.username')
	user2 = serializers.CharField(source='user2.username')
	user1_log_state = serializers.SerializerMethodField()
	user2_log_state = serializers.SerializerMethodField()

	class Meta:
		model = Friendship
		fields = ['user1', 'user2', 'user1_log_state', 'user2_log_state']

	def get_user1_log_state(self, obj):
		return self.get_log_state(obj.user1)

	def get_user2_log_state(self, obj):
		return self.get_log_state(obj.user2)

	def get_log_state(self, user):
		return 'online' if user.online_status else 'offline'

	def create(self, validated_data):
		user1_username = validated_data.pop('user1')['username']
		user2_username = validated_data.pop('user2')['username']
		user1 = PongUser.objects.get(username=user1_username)
		user2 = PongUser.objects.get(username=user2_username)
		friendship = Friendship.objects.create(user1=user1, user2=user2)
		return friendship

class AvatarUploadSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongUser
		fields = ['alias']