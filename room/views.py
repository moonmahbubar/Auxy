from room.models import Room, Host, User, Song
from rest_framework import viewsets 
from room.serializers import RoomSerializer, HostSerializer, UserSerializer, SongSerializer
from spotify_test import *
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpRequest, HttpResponse
from search_test import *
from django.utils.crypto import get_random_string
from authorization_flow import *
import json



class RoomViewSet(viewsets.ModelViewSet):
    """Handles the request and serializes the Room object."""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer



class HostViewSet(viewsets.ModelViewSet):
    """Handles the request and serializes the Host object."""
    queryset = Host.objects.all()
    serializer_class = HostSerializer


class UserViewSet(viewsets.ModelViewSet):
    """Handles the request and serializes the User object."""
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SongViewSet(viewsets.ModelViewSet):
    """Handles the request and serializes the Song object."""
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class SpotifyTestView(APIView):
    """Just for testing for playing a song. Ignore for now. """
    def get(self, request, code, song):
        room = Room.objects.all().filter(code=code)[0]
        host = room.host
        token = host.host_token
        play_song_test(token)
        return Response(data={"my_return_data":code})


class PlaySongView(APIView):
    """Handle get request for playing a specific song given the room code and song name."""
    def get(self, request, code, song):
        #Get room associated with the code.
        room = Room.objects.all().filter(code=code)[0]
        #Get host associated with the room.
        host = room.host
        #Get tokens.
        token = host.host_token
        refresh_token = host.host_refresh_token
        #Client Token
        cid = 'f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object.
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token.
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        #Update host tokens.
        host.token = token
        host.save()
        #Play the song.
        play_specific_song(token, song)
        #Return the song that is being played.
        return Response(data={"my_return_data":code, "current_song": song})

class SearchSongView(APIView):
    """Handle get request for searching a song through the spotify API and returning relevant matching songs."""
    def get(self, request, code, song):
        #Get room associated with code.
        room = Room.objects.all().filter(code=code)[0]
        #Get host associated with room.
        host = room.host
        #Get tokens.
        token = host.host_token
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object.
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token.
        response = sp.refresh_access_token(refresh_token)
        #Update tokens.
        token = response["access_token"]
        host.token = token
        host.save()
        #Get search results.
        result = search_song(token, song)
        #Return search results.
        return Response(data={"search_result":result})

class CreateHostView(APIView):
    """Call to create a host and a room, and associate them with each other."""
    def get(self, request, room_name, display_name, auth_code):
        #Generate a room code.
        code = get_random_string(length=6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        #Create the room object.
        room = Room(name=room_name, code=code)
        room.save()
        #Get tokens from spotify servers. And update them.
        tokens = get_tokens(auth_code)
        host_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        #Create host with the above attributes.
        host = Host(display_name=display_name, host_token=host_token, host_refresh_token=refresh_token, room=room)
        host.save()
        #Return code name.
        return Response(data={"created_room_code": code})

class UpdateTokensView(APIView):
    """Here for testing purposes. Ignore."""
    def get(self, request, url):
        tokens = get_tokens(url)
        return Response(data={"results":tokens})


class GetRoomInfoView(APIView):
    """Get the Users, Host, queue and activity of a room."""
    def get(self, request, code):
        #Get room associated with the code.
        room = Room.objects.all().filter(code=code)[0]
        #Get host associated with the room.
        host = room.host
        #Get users associated with the room using reverse lookup.
        users = room.user_set.all()
        #Serialize the queryset of users.
        users_serializer = UserSerializer(users, many=True, context={'request': request})   
        #Serialize the host.
        host_serializer = HostSerializer(host, context={'request': request})
        #Return the list of users in json format.
        songs = room.song_set.all().order_by('date_added')
        #Serialize the songs.
        songs_serializer = SongSerializer(songs, many=True, context={'request': request})  
        #Return as json format.
        return Response(data={"users": users_serializer.data, "host": host_serializer.data, "queue": songs_serializer.data, "room_active": room.is_active})

class JoinRoomView(APIView):
    """Call for adding a user to a room."""
    def get(self, request, display_name, code):
        #Get room associated with the room code.
        rooms = Room.objects.all().filter(code=code)
        #If room exists
        room_exists = bool(rooms)
        if room_exists:
            room = rooms[0]
            #Get all the users
            users = room.user_set.all()
            #Check if diplay name is available
            display_name_available = not bool(users.filter(display_name=display_name))
            if not display_name_available:
                return Response(data={"created_user": ["Display name is not available!"]})
            #Otherwise create the user.
            user = User(display_name=display_name, room=room)
            user.save()
            users_serializer = UserSerializer(users, many=True, context={'request': request})  
            return Response(data={"created_user": users_serializer.data})
        #Otherwise, return room not found.
        else:
            return Response(data={"created_user": ["Room not found!"]})

class PushSongView(APIView):
    """Call for adding a song to the queue."""
    def get(self, request, code, track_id, track_name, track_artist, track_art, track_length, votes):
        #Get room.
        room = Room.objects.all().filter(code=code)[0]
        #Create song object. Make sure to update attributes.
        song = Song(track_id=track_id, track_name=track_name, track_artist=track_artist, track_art=track_art, track_length=track_length, votes=votes, room=room)
        song.save()
        #Serialize the content.
        serializer = SongSerializer(song, context={'request': request})    
        #Return data in json format.
        return Response(data={"pushed_song": serializer.data})

class PopSongView(APIView):
    """Call for playing a song from the queue, and updating the queue by removing it."""
    def get(self, request, code):
        #Get room.
        room = Room.objects.all().filter(code=code)[0]
        #Sort songs in room by date added.
        song = room.song_set.all().order_by('date_added')[0]
        #Get room host.
        host = room.host
        #Get host tokens.
        token = host.host_token
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object.
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token.
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        #Update host attributes.
        host.token = token
        host.save()
        #Play the song.
        play_specific_song(token, song.track_name)
        #Delete the song.
        song.delete()
        #Return if song was successfully played.
        return Response(data={"popped_song": "success"})


class PlayIDView(APIView):
    """Plays a song given the track id."""
    def get(self, request, code, id):
        #Gett room.
        room = Room.objects.all().filter(code=code)[0]
        #Get host.
        host = room.host
        #Get tokens.
        token = host.host_token
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        host.token = token
        #Update host.
        host.save()
        #Play song by id.
        play_song_id(token, id)
        #Return song.
        return Response(data={"my_return_data":code, "current_song": id})


class GetRoomQueueView(APIView):
    """Returns the list of songs associated with a room."""
    def get(self, request, code):
        #Get room.
        room = Room.objects.all().filter(code=code)[0]
        #Get songs ordered by date.
        songs = room.song_set.all().order_by('date_added')
        #Serialize the songs.
        serializer = SongSerializer(songs, many=True, context={'request': request})  
        #Return as json format.
        return Response(data={"songs":serializer.data})


class DeleteSongView(APIView):
    """Deletes a song."""
    def get(self, request, auto_increment_id):
        #Get song with the unique id 
        songs = Song.objects.all().filter(auto_increment_id=auto_increment_id)
        #If a song is found.
        if songs:
            song = songs[0]
            song.delete()
            return Response(data="succesfully deleted!")
        else:
            return Response(data="Error! Song not found.")

class RefreshTokenView(APIView):
    """Refresh a token for a host."""
    def get(self, request, code):
        room = Room.objects.all().filter(code=code)[0]
        #Get host.
        host = room.host
        #Get tokens.
        refresh_token = host.host_refresh_token
        #Client Token
        cid ='f694f6f7a1584567948f99d653a9d070' 
        #Client Secret
        secret = '0e05c9eeee094a5d8d506d0435a18ee9' 
        #Current scope allows for modifying playback.
        scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
        #Once you run the script, copy and paste the link you are redirected to into the terminal.
        redirect_uri='http://localhost:3000/callback' 
        #Create OAuth2 object
        sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
        #Refresh token
        response = sp.refresh_access_token(refresh_token)
        token = response["access_token"]
        host.token = token
        #Update host.
        host.save()
        return Response(data={"new_token": token})

class DeleteUserView(APIView):
    """Delete a user from a room."""
    def get(self, request, code, display_name):
        #Get room.
        room = Room.objects.all().filter(code=code)[0]
        #Get user with display name.
        users = room.user_set.all().filter(display_name=display_name)
        #If one or more user is found:
        if users:
            #Delete users and return response.
            users.delete()
            return Response(data="Found user and deleted!")
        else:
            return Response(data="User not found!")

class DeactivateRoomView(APIView):
    """Deactivate a room and delete its host."""
    def get(self, request, code):
        #Get room.
        room = Room.objects.all().filter(code=code)[0]
        #Get host and delete.
        host = room.host
        host.delete()
        #Deactivate room.
        room.is_active = False
        room.save()
        return Response(data="Host and room deactivated!")





