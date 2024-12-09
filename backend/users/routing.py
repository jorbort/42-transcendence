from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path(r'ws/friends/(?P<username>\w+)/$', consumers.FriendConsumer.as_asgi()),
]