import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
from spotipy.oauth2 import SpotifyOAuth


def search_song(token, q):
    if token:
        #Authorize
        sp = spotipy.Spotify(auth=token)
        #Store search results in a dictionary
        song_results = []
        #Search query
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
            #Store the length of song in ms
            track_length = tracks[id]['duration_ms']
            #Of type num: (id, name)
            song_results.append({'track_id' : track_id, 'track_name' : track_name, 'track_artist' : artist_name, 'track_art' : track_art, 'track_length' : track_length})

        #Return Results
        return(song_results)
