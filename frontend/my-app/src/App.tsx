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
      console.log(initial['code'])
      authCode = initial['code']
      // dc.createRoom(partyName, displayName, initial['code']);
    }
    console.log(initial)
    return initial;
  }, {});

interface IState {
  partyName: string,
  displayName: string,
  token: string
}

interface IProps {}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      partyName: '',
      displayName: '',
      token: '',
    };

    this.setPartyName = this.setPartyName.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
  }

  // componentDidMount = () => {
  //   // Set token
  //   let _token = hash.access_token;
  //   if (_token) {
  //     // Set token
  //     this.setState({
  //       token: _token
  //     });
  //   }
  // }

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

    // let playSong = () => {
    //   dc.playSong('123456', this.state.value)
    // }

    return(
      <div className = "title">
          <h1>Welcome to Auxy</h1>

          <span>
            <button type = "button" onClick={login}>
              {/* <Link to="/create_party"> */}
              Host
              {/* </Link> */}
            </button>
            <button type = "button">Join</button>
          </span>
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.tsx</code> and save to reload.
      //     </p>
      //     {!this.state.token && (
      //       <button onClick={login}>
      //         Spotify Login
      //       </button>
      //     )}
      //     {this.state.token && (
      //       <p>{this.state.token}</p>
      //     )}
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }

  CallBack = () => {
    let extractToken = () => {
      // let token = window.location.hash;
      // token = token.substring(token.indexOf("=")+1, token.indexOf("&"));
      // // Send token to backend to create a new room OR add to state?
      // // Close the window
      // alert(token);
      dc.createRoom(this.state.partyName, this.state.displayName, authCode)
    }

    return(
      <div className="App">
        <h2>Congratualation, you signed into spotify!</h2>
        Party name:
        <input type='text' value={this.state.partyName} onChange={this.setPartyName}></input>
        Display name:
        <input type='text' value={this.state.displayName} onChange={this.setDisplayName}></input>
        <button onClick={extractToken}>party time B-)</button>
      </div>
    )
  }

  CreateParty = () => {
    let sendPartyInfo = () => {
      partyName = this.state.partyName;
      displayName = this.state.displayName;
      console.log(partyName)
      sp.getAuthCode();
    }

    return(
      <div>
        Party name:
        <input type='text' value={this.state.partyName} onChange={this.setPartyName}></input>
        Display name:
        <input type='text' value={this.state.displayName} onChange={this.setDisplayName}></input>
        <button onClick={sendPartyInfo}>Make a party :-)</button>
      </div>
    );
  }

  render() {
    return (
      <Router>
        <Route exact path="/" component={this.Landing} />
        <Route exact path="/callback" component={this.CallBack} />
        <Route exact path="/create_party" component={this.CreateParty}></Route>
      </Router>
    );
  }
}

export default App;
