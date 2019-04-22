import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

def play_song_test(token):
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
        sp.start_playback(uris=tracks)
        return token



def play_specific_song(token, song):
    if token:
        #Authorize
        sp = spotipy.Spotify(auth=token)
        #List of tracks to be added to the playback
        tracks = []
        #Search query
        q = song
        #Make search queue
        search_results = sp.search(q, limit=1, type='track')
        #Get track id
        track_id = search_results['tracks']['items'][0]['id']
        #Add track_id to list of tracks being added to playback
        tracks.append("spotify:track:" + track_id)
        #Start playing the songs.
        sp.start_playback(uris=tracks)
        return token