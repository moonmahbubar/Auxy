// Based on the login function in the angular2-spotify github
// https://github.com/eduardolima93/angular2-spotify/blob/master/angular2-spotify.ts

import { Observable, BehaviorSubject } from 'rxjs';
import { from } from 'rxjs';
import 'rxjs/Rx';

interface SpotifyConfig {
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    scope: string,
    authToken?: string,
    apiBase: string,
}
  
// interface SpotifyOptions {
//     limit?: number,
//     offset?: number,
//     market?: string,
//     album_type?: string,
//     country?: string,
//     type?: string,
//     q?: string,
//     timestamp?: string,
//     locale?: string,
//     public?: boolean,
//     name?: string,
//     time_range?: string,
//     after?: string,
//     before?: string,
// }

// interface HttpRequestOptions {
//     method?: string,
//     url: string,
//     search?: Object,
//     body?: Object,
//     headers?: Headers,
// }


export default class SpotifyLogin {
    private config: SpotifyConfig = {
        clientId: "f694f6f7a1584567948f99d653a9d070",
        clientSecret: "0e05c9eeee094a5d8d506d0435a18ee9",
        redirectUri: "http://auxy.netlify.com/callback",
        scope: "streaming user-read-birthdate user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
        authToken: "",
        apiBase: ""
    };
    // public token: string = "";
    // public tokenBS: BehaviorSubject<string> = new BehaviorSubject(this.token);
    constructor() {
        this.config.apiBase = 'https://api.spotify.com/v1';
    }

    // public getToken() {
    //     return this.tokenBS.asObservable();
    // }

    public getAuthCode() {
        var promise = new Promise((resolve, reject) => {
          // Login prompt window dimensions
          // var w = 400,
          //     h = 500,
          //     left = (screen.width / 2) - (w / 2),
          //     top = (screen.height / 2) - (h / 2);
    
          // Get info from config
          var params = {
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            scope: this.config.scope || '',
            response_type: 'code',
            show_dialog: true
          };
          var authCompleted = false;
          window.location.href = 'https://accounts.spotify.com/authorize?' + this.toQueryString(params)
          // var authWindow = this.openDialog(
          //   'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
          //   'Spotify',
          //   'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
          //   () => {
          //     if (!authCompleted) {
          //       return reject('Login rejected error');
          //     }
          //   }
          // );
    
          // // Setup callback for when new information is recieved
          // // When storage is changed, get the token to update the config object and close the window
          // // Set authCompleted to true and remove the event listener from the window and report success
          // var storageChanged = (e: any) => {
          //   //if (e.key === 'angular2-spotify-token') {
          //     if (authWindow) {
          //       this.token = e.url;
          //       alert(e.url)
          //       authWindow.close();
          //     }
          //     authCompleted = true;
    
          //     this.config.authToken = e.url;
          //     localStorage.setItem('token', e.url);
          //   //   this.tokenBS.next(e.url);
          //     window.removeEventListener('storage', storageChanged, false);
    
          //     return resolve(e.url);
          //   //}
          // };
          // window.addEventListener('storage', storageChanged, false);
        });
    
        return from(promise);
      }

    public getTokens(code: string) {
      var promise = new Promise((resolve, reject) => {
        var url = 'https://accounts.spotify.com/api/token',
            body = {
              code: code,
              redirect_uri: this.config.redirectUri,
              grant_type: 'authorization_code'
            },
            headers = {
              'Authorization': 'Basic ' + (new Buffer(this.config.clientId + ':' + this.config.clientSecret).toString('base64')),
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        // var authOptions = {
        //   url: 'https://accounts.spotify.com/api/token',
        //   form: {
        //     code: code,
        //     redirect_uri: this.config.redirectUri,
        //     grant_type: 'authorization_code'
        //   },
        //   headers: {
        //     'Authorization': 'Basic ' + (new Buffer(this.config.clientId + ':' + this.config.clientSecret).toString('base64'))
        //   },
        //   json: true
        // };

        fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
          // mode: 'no-cors'
        })
        .then(response => console.log(response))
      })

      return from(promise)
    }
    
      //login helpers
      // private openDialog(uri: any, name: any, options: any, cb: any) {
      //   // Create window
      //   var win = window.open(uri, name, options);
      //   var interval = window.setInterval(() => {
      //     try {
      //       if (!win || win.closed) {
      //         window.clearInterval(interval);
      //         cb(win);
      //       }
      //     } catch (e) { }
      //   }, 1000000);
      //   return win;
      // }
    
      private toQueryString(obj: any): string {
        var parts = [];
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
          }
        };
        return parts.join('&');
      };
    
      // private handleError(error: Response) {
      //   console.error(error);
      //   return Observable.throw('Server error');
      // }
}
  