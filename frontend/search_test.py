import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

#Client ID
cid ='f694f6f7a1584567948f99d653a9d070' 

#Client Secret
secret = '0e05c9eeee094a5d8d506d0435a18ee9' 

#Spotify Username
username = '22supsxyw37giydcor4utlowq' 

#For avaliable scopes see https://developer.spotify.com/web-api/using-scopes/
#Current scope allows for modifying playback.
scope = 'user-modify-playback-state'

#Once you run the script, copy and paste the link you are redirected to into the terminal.
redirect_uri='http://127.0.0.1:8000/catalog/'

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret) 

##Create spotify object.
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#Use fields to get token.
token = util.prompt_for_user_token(username, scope, cid, secret, redirect_uri)


if token:
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #Store search results in a dictionary
    song_directory = {}
    #Search query
    q = input("What song do you want to search? ")
    search_results = sp.search(q, type='track')
    tracks = search_results['tracks']['items']

    #Add artist and trfack names to search directory
    for id in range(len(tracks)):
        #Store artist name :: string
        artist_name = tracks[id]['artists'][0]['name']
        #Store track name
        track_name = tracks[id]['name']
        #Store track ID
        track_id = tracks[id]['id']
        #Of type num: (id, name)
        song_directory[id] = (track_id, artist_name + " - " + track_name)
    
    #Print Results
    for id in song_directory.keys():
        print(str(id) + ": " + song_directory[id][1])
    
    #Get which song number is being played
    play_track_num = input("Which song you do want to play? (Enter the ID #):  ")
    #Lookup ID
    play_track_id = song_directory[int(play_track_num)][0]
    print(play_track_id)
    #Play song
    tracks = []
    tracks.append("spotify:track:" + play_track_id)
    sp.start_playback(uris = tracks)


