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
import json

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
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        host.token = token
        host.save()
        play_specific_song(token, song)
        return Response(data={"my_return_data":code, "current_song": song})

class SearchSongView(APIView):
    def get(self, request, code, song):
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        host.token = token
        host.save()
        result = search_song(token, song)
        return Response(data={"search_result":result})

class CreateHostView(APIView):
    def get(self, request, room_name, display_name, auth_code):
        code = get_random_string(length=6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        room = Room(name=room_name, code=code)
        room.save()
        tokens = get_tokens(auth_code)
        #tokens = json.loads(response)
        host_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        host = Host(display_name=display_name, host_token=host_token, host_refresh_token=refresh_token, room=room)
        host.save()
        return Response(data={"created_room_code": code})

class UpdateTokensView(APIView):
    def get(self, request, url):
        tokens = get_tokens(url)
        return Response(data={"results":tokens})


class GetRoomUsersView(APIView):
    def get(self, request, code):
        room = Room.objects.all().filter(code=code)[0]
        users = room.user_set.all()
        serializer = UserSerializer(users, many=True, context={'request': request})    
        return Response(data = {"users": serializer.data})
