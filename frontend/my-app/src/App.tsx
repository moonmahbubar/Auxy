// Spotify authorization functionality based on
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';

export const authEndpoint = 'https://accounts.spotify.com/authorize?';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "f694f6f7a1584567948f99d653a9d070";
const redirectUri = "http://localhost:3000/callback";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
  "user-read-birthdate",
  "user-follow-modify",
  "user-follow-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-library-modify",
  "user-read-private"
];

let sp = new SpotifyLogin()
let dc = new DjangoCalls()

// Get the hash of the url
const hash = window.location.search
  .substring(1)
  .split("&")
  .reduce(function(initial: any, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    if (initial['code'] != undefined) {
      dc.sendAuthCode(window.location.href)
    }
    console.log(initial)
    return initial;
  }, {});
window.location.hash = "";

interface IState {
  value: string,
  token: string
}

interface IProps {}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
      token: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = () => {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }
  }

  handleChange = (event: any) => {
    this.setState({value: event.target.value});
  }

  Landing = () => {
    let login = () => {
      // When the token comes, move to next page
      // let tokenSub = sp.getToken().subscribe(token => console.log(token));
      sp.getAuthCode();
      // setTimeout(() => console.log(sp.token), 15000)
    }

    let playSong = () => {
      dc.playSong('123456', this.state.value)
    }

    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          {!this.state.token && (
            <button onClick={login}>
              Spotify Login
            </button>
          )}
          {this.state.token && (
            <p>{this.state.token}</p>
          )}
          {/* <input type='text' value={this.state.value} onChange={this.handleChange}></input>
          <button onClick={playSong}>Play a song</button> */}
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

  CallBack = () => {
    let extractToken = () => {
      let token = window.location.hash;
      token = token.substring(token.indexOf("=")+1, token.indexOf("&"));
      // Send token to backend to create a new room OR add to state?
      // Close the window
      alert(token);
    }

    return(
      <div className="App">
        <h2>Congratualation, you signed into spotify!</h2>
        <input type='text' value={this.state.value} onChange={this.handleChange}></input>
        <button onClick={extractToken}>party time B-)</button>
      </div>
    )
  }

  render() {
    return (
      <Router>
        <Route exact path="/" component={this.Landing} />
        <Route exact path="/callback" component={this.CallBack} />
      </Router>
    );
  }
}

export default App;
