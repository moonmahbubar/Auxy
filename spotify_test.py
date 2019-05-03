import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util

def play_song_test(token):
    if token:
        # Authorize
        sp = spotipy.Spotify(auth=token)
        # List of tracks to be added to the playback
        tracks = []
        # Search query
        q = "feel the love"
        # Make search queue
        search_results = sp.search(q, limit=1, type='track')
        # Get track id
        track_id = search_results['tracks']['items'][0]['id']
        # Add track_id to list of tracks being added to playback
        tracks.append("spotify:track:" + track_id)
        # Start playing the songs.
        sp.start_playback(uris=tracks)
        return token


def play_specific_song(token, song):
    if token:
        # Authorize
        sp = spotipy.Spotify(auth=token)
        # List of tracks to be added to the playback
        tracks = []
        # Search query
        q = song
        # Make search queue
        search_results = sp.search(q, limit=1, type='track')
        # Get track id
        track_id = search_results['tracks']['items'][0]['id']
        # Add track_id to list of tracks being added to playback
        tracks.append("spotify:track:" + track_id)
        # Start playing the songs.
        sp.start_playback(uris=tracks)
        return token


def play_song_id(token, track_id):
    if token:
        # Authorize
        sp = spotipy.Spotify(auth=token)
        # List of tracks to be added to the playback
        tracks = []
        # Add track_id to list of tracks being added to playback
        tracks.append("spotify:track:" + track_id)
        # Start playing the songs.
        devices = sp.devices()
        auxy_device_id = [device["id"]  for device in devices["devices"] if device["name"] == "AUXY"][0]
        sp.start_playback(device_id=auxy_device_id, uris=tracks)
        return token


def get_current_playback(token):
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #Make spotify call to get current playback information.
    current_playback = sp.current_playback()
    if current_playback is None:
        return "None"
    #Create dictionary to return.
    current_playback_parsed = {}
    #Add all the requried values.
    current_playback_parsed['track_name'] = current_playback["item"]["name"]
    current_playback_parsed['track_artist'] = current_playback["item"]["artists"][0]["name"]
    current_playback_parsed['track_length'] =  current_playback["item"]["duration_ms"]
    current_playback_parsed['track_progress'] = current_playback["progress_ms"]
    current_playback_parsed['track_art'] = current_playback["item"]["album"]["images"][0]["url"]
    #Return parsed data.
    return current_playback_parsed


def is_song_playing(token):
    #Authorize
    sp = spotipy.Spotify(auth=token)
    return bool(sp.current_playback())

def is_paused(token):
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #Get current playback information.
    cp = sp.current_playback()
    #Check if song is being played.
    paused = cp["is_playing"]
    return not paused

def middle_song(token):
    #Authorize
    sp = spotipy.Spotify(auth=token)
    #Get current playback information.
    current_playback = sp.current_playback()
    #Check if song is in middle of playback.
    middle = (current_playback["progress_ms"] > 1000) and (current_playback["progress_ms"] <  (current_playback["item"]["duration_ms"] - 1000))
    return middle