from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('players/', views.view_players, name='view_players'),
    path('tournament/', views.create_tournament, name='create_tournament'),
    path('view/', views.view_tournament, name='view_tournament'),
    path('list/', views.tournament_list, name='tournament_list'),
    path('join/<int:tournament_id>/', views.join_tournament, name='join_tournament'),
]
