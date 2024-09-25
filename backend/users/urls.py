from django.urls import path
from users import views
from .views import LoginView

urlpatterns = [
	path('', views.hello_world),
	path('create', views.addUser),
	path('read/<str:pk>', views.getUser),
	path('update', views.update_user_info),
	path('listAll', views.getUsers),
	path('login', LoginView.as_view(), name='login'),
	path('verify', views.OtpVerify),
	path('logout', views.logout_view),
	path('matches/register',views.record_match),
	path('matches/obtainHistory',views.match_history),
	path('friends', views.add_friend),
	path('upload_avatar/', views.upload_avatar),
	path('TokenRefresh', views.refreshTokens),
	path('update_user_info/', views.update_user_info, name='update_user_info')
]