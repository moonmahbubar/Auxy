from spotipy.oauth2 import SpotifyOAuth


def get_tokens(url):
    #Client ID
    cid ='f694f6f7a1584567948f99d653a9d070' 

    #Client Secret
    secret = '0e05c9eeee094a5d8d506d0435a18ee9' 

    #For avaliable scopes see https://developer.spotify.com/web-api/using-scopes/
    #Current scope allows for modifying playback.
    scope = 'user-modify-playback-state'

    #Once you run the script, copy and paste the link you are redirected to into the terminal.
    redirect_uri="http://localhost:3000/callback"

    sp = SpotifyOAuth(cid, secret, redirect_uri, state=None, scope=scope, cache_path=None, proxies=None)
    token = sp.get_access_token(url)

    return token