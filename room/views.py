from room.models import Room, Host, User
from rest_framework import viewsets 
from room.serializers import RoomSerializer, HostSerializer, UserSerializer
from spotify_test import *
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpRequest, HttpResponse
from search_test import *
from django.utils.crypto import get_random_string
from authorization_flow import *

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
        ##Modify to use reverse relation!!!!! IMPORTANT
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        play_song_test(token)
        return Response(data={"my_return_data":code})


class PlaySongView(APIView):
    def get(self, request, code, song):
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        play_specific_song(token, song)
        return Response(data={"my_return_data":code, "current_song": song})

class SearchSongView(APIView):
    def get(self, request, code, song):
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        result = search_song(token, song)
        return Response(data={"search_result":result})

class CreateHostView(APIView):
    def get(self, request, room_name, display_name, auth_code):
        code = get_random_string(length=6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        room = Room(name=room_name, code=code)
        room.save()
        response = get_tokens(auth_code)
        tokens = json.loads(response)
        host_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        host = Host(display_name=display_name, host_token=host_token, host_refresh_token=refresh_token, room=room)
        host.save()
        return Response(data={"created_host": HostSerializer(host, context={'request': request}).data})

class UpdateTokensView(APIView):
    def get(self, request, url):
        tokens = get_tokens(url)
        return Response(data={"results":tokens})
