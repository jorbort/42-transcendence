from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('players/', views.view_players, name='view_players'),
    path('tournament/', views.create_tournament, name='create_tournament'),
    path('tournament/view/', views.view_tournament, name='view_tournament'),
]
