from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from users.models import PongUser, MatchHistory
from django.contrib import messages
from .forms import UserRegistrationForm
from django.http import HttpResponse
from .models import Tournament
import random

# Vista para registrar jugadores
def register_player(request):
    if request.method == 'POST':
        name = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        if PongUser.objects.filter(username=name).exists():
            messages.error(request, "Username is already taken. Please choose another.")
            return redirect('register')  # Or render the same page with an error
        else:
            player = PongUser.objects.create(username=name, email=email, password=password)
            return redirect('view_players')
    return render(request, 'register_player.html')

# Vista para ver los jugadores registrados

def view_players(request):
    players = PongUser.objects.all()
    return render(request, 'view_players.html', {'players': players})

# Vista para crear el torneo (partidas)
# @login_required
def create_tournament(request):
    players = list(PongUser.objects.all())
    if len(players) < 2:
        return HttpResponse("Se requieren al menos 2 jugadores para iniciar el torneo.")
    # Emparejar jugadores aleatoriamente
    random.shuffle(players)
    matches = []
    for i in range(0, len(players), 2):
        if i+1 < len(players):
            match = MatchHistory.objects.create(player_1=players[i], player_2=players[i+1], winner=players[i])
            matches.append(match)
    return render(request, 'tournament.html', {'matches': matches})

# Vista para ver los partidos del torneo
# @login_required
def view_tournament(request):
    matches = MatchHistory.objects.all()
    return render(request, 'view_tournament.html', {'matches': matches})


# Vista de registro

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            register_player(request)
            messages.success(request, f'Cuenta creada para {user.username}!')
            return redirect('view_players')  # Redirige al listado de jugadores o inicio del torneo
        else:
            form = UserRegistrationForm()
            return render(request, 'register.html', {'form': form})
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})

# Vista de perfil de usuario
# @login_required
def profile(request):
    return render(request, 'profile.html')

# @login_required
def tournament_list(request):
    tournaments = Tournament.objects.all()  # Lista de todos los torneos

    if request.method == "POST":
        # Logica para crear un nuevo torneo
        name = request.POST.get('name')
        is_public = request.POST.get('is_public') == 'on'
        user1 = PongUser.objects.first()
        new_tournament = Tournament.objects.create(
            name=name,
            created_by=user1,
            is_public=is_public
        )
        new_tournament.participants.add(user1)  # El creador es el primer participante
        return redirect('tournament_list')

    return render(request, 'tournament_list.html', {
        'tournaments': tournaments
    })

# @login_required
def join_tournament(request, tournament_id):
    tournament = Tournament.objects.get(id=tournament_id)
    user1 = PongUser.objects.first()
    tournament.participants.add(user1)  # Añadir al usuario a la lista de participantes
    return redirect('tournament_list')