from django.urls import path
from .views import TournamentListCreateView

urlpatterns = [
    path('api/tournaments/', TournamentListCreateView.as_view(), name='tournament-list-create'),
]
