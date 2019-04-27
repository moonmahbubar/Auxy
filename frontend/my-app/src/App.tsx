// Spotify authorization functionality based on
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';

export const authEndpoint = 'https://accounts.spotify.com/authorize?';

let sp = new SpotifyLogin()
let dc = new DjangoCalls()
let partyName = ''
let displayName = ''
let authCode = ''

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
      authCode = initial['code']
    }
    return initial;
  }, {});

interface IState {
  partyName: string,
  displayName: string,
}

interface IProps {}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      partyName: '',
      displayName: '',
    };

    this.setPartyName = this.setPartyName.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
  }

  setPartyName = (event: any) => {
    this.setState({partyName: event.target.value});
  }

  setDisplayName = (event: any) => {
    this.setState({displayName: event.target.value})
  }

  Landing = () => {
    let login = () => {
      sp.getAuthCode();
    }

    return(
      <div className = "title">
          <h1>Welcome to Auxy</h1>

          <span>
            <button type = "button" onClick={login}>
              Host
            </button>
            <button type = "button">Join</button>
          </span>
      </div>
    );
  }

  CallBack = () => {
    let sendPartyInfo = () => {
      dc.createRoom(this.state.partyName, this.state.displayName, authCode)
    }

    return(
      <div className="App">
        <h2>Congratualation, you signed into spotify!</h2>
        Party name:
        <input type='text' value={this.state.partyName} onChange={this.setPartyName}></input>
        Display name:
        <input type='text' value={this.state.displayName} onChange={this.setDisplayName}></input>
        <button onClick={sendPartyInfo}>party time B-)</button>
      </div>
    )
  }

  PartyRoom = () => {
    return(
      <div>
        its a party
      </div>
    )
  }

  render() {
    return (
      <Router>
        <Route exact path="/" component={this.Landing} />
        <Route exact path="/callback" component={this.CallBack} />
        <Route exact path="/party" component={this.PartyRoom} />
      </Router>
    );
  }
}

export default App;
