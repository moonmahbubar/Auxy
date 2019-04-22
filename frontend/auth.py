import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
import sys 

#Client ID
cid ='f694f6f7a1584567948f99d653a9d070' 

#Client Secret
secret = '0e05c9eeee094a5d8d506d0435a18ee9' 

#Spotify Username
username = '22supsxyw37giydcor4utlowq' 

#For avaliable scopes see https://developer.spotify.com/web-api/using-scopes/
#Current scope allows for modifying playback.
scope = 'user-library-read'

#Once you run the script, copy and paste the link you are redirected to into the terminal.
redirect_uri='http://127.0.0.1:8000/catalog/' 

#Use fields to get token.
token = util.prompt_for_user_token(username, scope, cid, secret, redirect_uri)

if token:
    sp = spotipy.Spotify(auth=token)
    results = sp.current_user_saved_tracks()
    for item in results['items']:
        track = item['track']
        print(track['name'] + ' - ' + track['artists'][0]['name'])
else:
    print("Can't get token for", username)