# from django.urls import path
# from torneo_app import views

# urlpatterns = [
#     path('register/', views.register_player, name='register_player'),
#     path('players/', views.view_players, name='view_players'),
#     path('tournament/', views.create_tournament, name='create_tournament'),
#     path('tournament/view/', views.view_tournament, name='view_tournament'),
# ]
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),  # Autenticación por defecto de Django
    path('tournament/', include('torneo_app.urls')),  # Las URLs de tu app
]

