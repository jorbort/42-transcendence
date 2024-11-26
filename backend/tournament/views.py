from faker import Faker
import random
from rest_framework.views import APIView
from rest_framework.response import Response

class TorneoEstadoAPIView(APIView):
    def get(self, request, torneo_id):
        torneo = Torneo.objects.get(id=torneo_id)
        partidos = Partido.objects.filter(jugador1__isnull=False).order_by('ronda')
        # data = {
        #     "torneo": torneo.nombre,
        #     "estado": torneo.estado,
        #     "partidos": [
        #         {
        #             "jugador1": p.jugador1.nombre,
        #             "jugador2": p.jugador2.nombre if p.jugador2 else "IA",
        #             "ganador": p.ganador.nombre if p.ganador else None,
        #             "ronda": p.ronda
        #         }
        #         for p in partidos
        #     ]
        # }
        serializer = TorneoDetalleSerializer(partidos)
        return Response(serislizer)

class CrearTorneoAPIView(APIView):
    def post(self, request):
        nombre = request.data.get('nombre', 'Torneo Anónimo')
        torneo = crear_torneo(nombre)
        serializer = TorneoSerializer(torneo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def generar_jugadores_aleatorios(cantidad=8):
    fake = Faker()
    for _ in range(cantidad):
        Usuario.objects.create(nombre=fake.first_name(), es_ia=random.choice([True, False]))

def crear_torneo(nombre):
    jugadores = list(Usuario.objects.all())
    if len(jugadores) < 8:  # Rellenar si hay menos de 8
        generar_jugadores_aleatorios(8 - len(jugadores))
        jugadores = list(Usuario.objects.all())

    random.shuffle(jugadores)
    torneo = Torneo.objects.create(nombre=nombre)

    # Crear emparejamientos para la primera ronda
    for i in range(0, len(jugadores), 2):
        Partido.objects.create(
            jugador1=jugadores[i],
            jugador2=jugadores[i+1],
            ronda=1
        )
    return torneo

