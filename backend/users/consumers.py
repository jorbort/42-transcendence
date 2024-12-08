import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import PongUser, Friendship

class FriendConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.username = self.scope['url_route']['kwargs']['username']
		self.group_name = f'friends_{self.username}'

		await self.channel_layer.group_add(
			self.group_name,
			self.channel_name
		)

		await self.accept()

		await self.update_online_status(self.username, True)
		await self.notify_friends(self.username, 'online')
	
	async def disconnect(self, close_code):
		await self.update_online_status(self.username, False)
		await self.notify_friends(self.username, 'offline')

		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)
	async def receive(self,text_data):
		data = json.loads(text_data)
		message = data['message']

		await self.channel_layer.group_send(
			self.group_name,
			{
				'type': 'friend_status',
				'message' : message
			}
		)
	
	async def friend_status(self,event):
		message = event['message']

		await self.send(text_data=json.dumps({
			'message' : message
		}))
	
	@database_sync_to_async
	def get_friends(self,username):
		user = PongUser.objects.get(username=username)
		friendships = Friendship.objects.filter(user1=user) | Friendship.objects.filter(user2=user)
		friends = set()
		for friendship in friendships:
			if friendship.user1 == user:
				friends.add(friendship.user2.username)
			else:
				friends.add(friendship.user1.username)
		return friends
	
	@database_sync_to_async
	def update_online_status(self, username, status):
		user = PongUser.objects.get(username=username)
		user.online_status = status
		user.save()

	async def notify_friends(self, username, status):
		friends = await self.get_friends(username)
		for friend in friends:
			await self.channel_layer.group_send(
				f'friends_{friend}',
				{
					'type': 'friend_status',
					'message': f'{username} is {status}'
				}
			)