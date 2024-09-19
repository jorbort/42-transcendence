from rest_framework import serializers
from .models import PongUser

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model=PongUser
		fields='__all__'