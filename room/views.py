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


class SpotifyTestView(APIView):
    def get(self, request, code, song):
        code = code.split('=')[1]
        song = song.split('=')[1]
        ##Modify to use reverse relation!!!!! IMPORTANT
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        play_song_test(token)
        return Response(data={"my_return_data":code})


class PlaySongView(APIView):
    def get(self, request, code, song):
        code = code.split('=')[1]
        song = song.split('=')[1]
        ##Modify to use reverse relation!!!!! IMPORTANT
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        play_specific_song(token, song)
        return Response(data={"my_return_data":code, "current_song": song})
