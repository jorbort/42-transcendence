from rest_framework import serializers
from .models import Usuario
from .models import Partido
from .models import Torneo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'es_ia']


class PartidoSerializer(serializers.ModelSerializer):
    jugador1 = UsuarioSerializer()
    jugador2 = UsuarioSerializer(allow_null=True)  # Si es IA, será null
    ganador = UsuarioSerializer(allow_null=True)

    class Meta:
        model = Partido
        fields = '__all__'



class TorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Torneo
        fields = '__all__'

class TorneoDetalleSerializer(serializers.ModelSerializer):
    partidos = PartidoSerializer(many=True, read_only=True, source='partido_set')

    class Meta:
        model = Torneo
        fields = '__all__'
