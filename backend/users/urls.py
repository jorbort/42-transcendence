from django.urls import path
from users.views.crud_user import (
	hello_world, addUser, getUser, update_user_info, getUsers, 
    OtpVerify, logout_view, add_friend, upload_avatar
)
from users.views import LoginView
from users.views.match import record_match, match_history
from users.views.refresh_tokens import refreshTokens
from users.views.FortyTwoLogin import login_42, callback_42


urlpatterns = [
	path('', hello_world), 
	path('create', addUser), #http://localhost:8000/users/create
	path('read/<str:pk>', getUser), #http://localhost:8000/users/read
	path('update', update_user_info),#http://localhost:8000/users/update
	path('listAll', getUsers),
	path('login', LoginView.as_view(), name='login'), #http://localhost:8000/users/login
	path('verify', OtpVerify), #http://localhost:8000/users/verify
	path('logout', logout_view),#http://localhost:8000/users/logout
	path('matches/register',record_match),#http://localhost:8000/matches/register
	path('matches/obtainHistory',match_history),#http://localhost:8000/matches/obtainHistory
	path('friends', add_friend), #http://localhost:8000/users/friends
	path('upload_avatar', upload_avatar), #http://localhost:8000/users/upload_avatar
	path('TokenRefresh', refreshTokens), #http://localhost:8000/users/TokenRefresh
	path('login_42', login_42, name='login_42'), #http://localhost:8000/users/login_42
    path('callback_42', callback_42, name='callback_42'),#http://localhost:8000/users/callback_42
]