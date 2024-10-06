from django.urls import path
from users import views

urlpatterns = [
	path('', views.hello_world),
	path('create', views.addUser),
	path('read/<str:pk>', views.getUser),
	path('listAll', views.getUsers)
]