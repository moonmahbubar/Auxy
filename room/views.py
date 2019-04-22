from room.models import Room, Host, User
from rest_framework import viewsets 
from room.serializers import RoomSerializer, HostSerializer, UserSerializer
from spotify_test import *
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpRequest, HttpResponse
# Create your views here.


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer



class HostViewSet(viewsets.ModelViewSet):
    queryset = Host.objects.all()
    serializer_class = HostSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def play_with_token(request, token):
    token = token.split('=')[1]
    token = play_song_test(token)
    html = "<html><body> Your token is %s</body></html>" % token
    return HttpResponse(html)
    
def play_room_song(request, code):
    code = code.split('=')[1]
    room = Room.objects.all().filter(code=code)[0]
    hosts = Host.objects.all().filter(room=room)
    token = hosts[0].host_token
    play_song_test(token)
    html = "<html><body> Your token is %s</body></html>" % token
    return HttpResponse(html)


class SpotifyTestView(APIView):
    def get(self, request, code):
        code = code.split('=')[1]
        room = Room.objects.all().filter(code=code)[0]
        hosts = Host.objects.all().filter(room=room)
        token = hosts[0].host_token
        play_song_test(token)
        return Response(data={"my_return_data":code})
