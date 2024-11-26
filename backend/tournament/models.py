from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    es_ia = models.BooleanField(default=False)  # Indica si es un jugador IA

class Partido(models.Model):
    jugador1 = models.ForeignKey(Usuario, related_name='partidos_jugador1', on_delete=models.CASCADE)
    jugador2 = models.ForeignKey(Usuario, related_name='partidos_jugador2', on_delete=models.CASCADE, null=True, blank=True)
    ganador = models.ForeignKey(Usuario, related_name='partidos_ganados', on_delete=models.SET_NULL, null=True, blank=True)
    ronda = models.IntegerField()

class Torneo(models.Model):
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=[('EN_PROGRESO', 'En Progreso'), ('FINALIZADO', 'Finalizado')], default='EN_PROGRESO')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
