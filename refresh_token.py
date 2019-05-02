import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

#Client ID
cid ='f694f6f7a1584567948f99d653a9d070' 

#Client Secret
secret = '0e05c9eeee094a5d8d506d0435a18ee9' 

#Spotify Username
username = 'uu9pzuu0y10fu0f5dx2210xb5' 

#For avaliable scopes see https://developer.spotify.com/web-api/using-scopes/
#Current scope allows for modifying playback.
scope = 'streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state''

#Once you run the script, copy and paste the link you are redirected to into the terminal.
redirect_uri='localhost:3000/callback' 

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret) 

##Create spotify object.
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#Use fields to get token.
token = util.prompt_for_user_token(username, scope, cid, secret, redirect_uri)

from room.models import Room, Host, User
room_code = "123456"
my_room = Room.objects.all().filter(code=room_code)[0]
my_host = my_room.host
my_host.host_token = token
my_host.save()

