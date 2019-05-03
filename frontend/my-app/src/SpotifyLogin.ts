// Based on the login function in the angular2-spotify github
// https://github.com/eduardolima93/angular2-spotify/blob/master/angular2-spotify.ts

import { from } from 'rxjs';
import 'rxjs/Rx';

// Define a class for a spotify config object
interface SpotifyConfig {
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    scope: string,
    authToken?: string,
    apiBase: string,
}

// Class to handle spotify authorization
export default class SpotifyLogin {
  // Create config object
  private config: SpotifyConfig = {
      clientId: "f694f6f7a1584567948f99d653a9d070",
      clientSecret: "0e05c9eeee094a5d8d506d0435a18ee9",
      redirectUri: "http://localhost:3000/callback",
      scope: "streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
      authToken: "",
      apiBase: ""
  };

  constructor() {
      this.config.apiBase = 'https://api.spotify.com/v1';
  }

  // Get auth code from spotify endpoint 
  public getAuthCode() {
      var promise = new Promise((resolve, reject) => {
        var params = {
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          scope: this.config.scope || '',
          response_type: 'code',
          show_dialog: true
        };
        window.location.href = 'https://accounts.spotify.com/authorize?' + this.toQueryString(params)
      });
  
      return from(promise);
    }
  
  private toQueryString(obj: any): string {
    var parts = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    };
    return parts.join('&');
  };
}
  