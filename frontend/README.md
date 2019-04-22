# Spotify API Test


## Requirements
- You need python3. 
- You need to install spotipy from the github source. The version provided by pip is deprecated. Run `pip install git+https://github.com/plamere/spotipy.git --upgrade` to upgrade your version of spotipy.
## Getting Started
Put your Spotify Web API keys in  `spotify_test.py` and `search_test.py`. You also need to enter your spotify username, which can be found in `https://www.spotify.com/us/account/overview/`.

You also need to enter your Web Playback SDK key in `index.html`. You can get the key in `https://developer.spotify.com/documentation/web-playback-sdk/quick-start/`. The SDK key expires every hour, so you need to renew it.


When you run `spotify_test.py` or `search_test.py` for the first time, you will be redirected to a page in your browser. Copy whatever page you were redirected to, and paste it back into the terminal.

## Using The Web Player
Open `index.html` in your web browser, and open the console. You should not see any SDK errors if the page successfully connects to the Spotify servers. Once connected, open up your phone and play a song on the device `Auxy`. The song should play on your browser now. To change songs, you can run `spotify_test.py`.
