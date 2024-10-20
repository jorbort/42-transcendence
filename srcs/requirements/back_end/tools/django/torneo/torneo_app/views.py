from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import UserRegistrationForm
from django.http import HttpResponse
from .models import Player, Match
import random

# Vista para registrar jugadores
@login_required
def register_player(request):
    if request.method == 'POST':
        name = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        player = Player.objects.create(name=name, email=email, password=password)
        return redirect('view_players')
    return render(request, 'register_player.html')

# Vista para ver los jugadores registrados
@login_required
def view_players(request):
    players = Player.objects.all()
    return render(request, 'view_players.html', {'players': players})

# Vista para crear el torneo (partidas)
@login_required
def create_tournament(request):
    players = list(Player.objects.all())
    if len(players) < 2:
        return HttpResponse("Se requieren al menos 2 jugadores para iniciar el torneo.")
    # Emparejar jugadores aleatoriamente
    random.shuffle(players)
    matches = []
    for i in range(0, len(players), 2):
        if i+1 < len(players):
            match = Match.objects.create(player_1=players[i], player_2=players[i+1])
            matches.append(match)
    return render(request, 'tournament.html', {'matches': matches})

# Vista para ver los partidos del torneo
@login_required
def view_tournament(request):
    matches = Match.objects.all()
    return render(request, 'view_tournament.html', {'matches': matches})


# Vista de registro
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Inicia sesión automáticamente después de registrarse
            register_player(request)
            messages.success(request, f'Cuenta creada para {user.username}!')
            return redirect('view_players')  # Redirige al listado de jugadores o inicio del torneo
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

# Vista de perfil de usuario
@login_required
def profile(request):
    return render(request, 'profile.html')