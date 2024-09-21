from django.urls import path
from users import views
from .views import LoginView

urlpatterns = [
	path('', views.hello_world),
	path('create', views.addUser),
	path('read/<str:pk>', views.getUser),
	path('listAll', views.getUsers),
	path('login', LoginView.as_view(), name='login'),
	path('verify', views.OtpVerify),
]