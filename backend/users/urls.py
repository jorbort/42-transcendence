from django.urls import path
from users.views.crud_user import (
	hello_world, addUser, getUser, update_user_info, getUsers, 
	 add_friend, upload_avatar, get_friends
)
from users.views.match import record_match, match_history
from users.views.refresh_tokens import refreshTokens
from users.views.FortyTwoLogin import login_42, callback_42
from users.views.login_views import  LoginView , OtpVerify, logout_view

urlpatterns = [
	# path('', hello_world),
	path('create/', addUser), #https://localhost:8000/users/create
	# path('read/<str:pk>', getUser), #https://localhost:8000/users/read
	path('update/', update_user_info),#https://localhost:8000/users/update
	# path('listAll/', getUsers),
	path('login/', LoginView.as_view(), name='login'), #https://localhost:8000/users/login
	path('verify/', OtpVerify), #https://localhost:8000/users/verify
	path('logout/', logout_view),#https://localhost:8000/users/logout
	path('matches/register/',record_match),#https://localhost:8000/users/matches/register
	path('matches/obtainHistory/',match_history),#https://localhost:8000/users/matches/obtainHistory
	path('friends/', add_friend), #https://localhost:8000/users/friends
	path('upload_avatar/', upload_avatar, name='upload_avatar'), #https://localhost:8000/users/upload_avatar
	path('TokenRefresh/', refreshTokens), #https://localhost:8000/users/TokenRefresh
	path('login_42/', login_42, name='login_42'), #https://localhost:8000/users/login_42
    path('callback_42/', callback_42, name='callback_42'),#https://localhost:8000/users/callback_42
	path('listFriends/', get_friends) #https://localhost:8000/users/listFriends
]