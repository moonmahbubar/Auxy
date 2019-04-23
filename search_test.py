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
redirect_uri='https://developer.spotify.com/dashboard/applications/f694f6f7a1584567948f99d653a9d070'

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)

##Create spotify object.
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

## Use fields to get token.
token = util.prompt_for_user_token(username, scope, cid, secret, redirect_uri)
# token = "BQDayrIMzxMsJxUK-hQBOOsWqzWRRW29cm_xMPtR6YJfnUuKywt-kC5slah7cEn8LOwBG0d9Y1sw1V2qU1xkOmQ0Uiaptkg0Xf-sNdpp6FQhF3RoranVlCDHqdGa2R_PhdndTEkw6twLbOqxswUVIwgoIFdpD9t0ImGZJGpn2nfIP_fDD2eKsgTNWT6nF6vBfWsMx9Oo1YA3obQS936xU0jvKay_9ib9zfyrJWZnmvJFHl8qimpliFV1LKpc1XWKjoTT42X61nSZiZ-XlGMTqoGSclQwzQInBg"


if token:
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #Store search results in a dictionary
    song_results = []
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
        #Store song cover art
        track_art = tracks[id]['album']['images'][0]['url']
        #Of type num: (id, name)
        song_results.append({'track_id' : track_id, 'track_name' : track_name, 'track_artist' : artist_name, 'track_art' : track_art})

    #Print Results
    print(song_results)
    # for id in song_results:
    #     print(str(id) + ": " + song_results[id]['track_name'])

    #Get which song number is being played
    # play_track_num = input("Which song you do want to play? (Enter the ID #):  ")
    #Lookup ID
    # play_track_id = song_directory[int(play_track_num)][0]
    # print(play_track_id)
    # #Play song
    # tracks = []
    # tracks.append("spotify:track:" + play_track_id)
    # sp.start_playback(uris = tracks)
