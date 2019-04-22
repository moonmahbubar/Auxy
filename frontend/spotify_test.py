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
scope = 'user-modify-playback-state'

#Once you run the script, copy and paste the link you are redirected to into the terminal.
redirect_uri='https://developer.spotify.com/dashboard/applications/f694f6f7a1584567948f99d653a9d070' 

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret) 

##Create spotify object.
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#Use fields to get token.
token = util.prompt_for_user_token(username, scope, cid, secret, redirect_uri)


if token:
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #List of tracks to be added to the playback
    tracks = []
    #Search query
    q = "feel the love"
    #Make search queue
    search_results = sp.search(q, limit=1, type='track')
    #Get track id
    track_id = search_results['tracks']['items'][0]['id']
    #Add track_id to list of tracks being added to playback
    tracks.append("spotify:track:" + track_id)
    #Start playing the songs.
    sp.start_playback(uris = tracks)

else:
    print("Can't get token for", username)