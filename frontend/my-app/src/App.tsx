// Spotify authorization functionality based on
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';

export const authEndpoint = 'https://accounts.spotify.com/authorize?';

let sp = new SpotifyLogin()
let dc = new DjangoCalls()
let authCode = ''

// Retrieves autorization code after spotify authorization flow callback and saves in variable authCode
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


// Interface for state of component (needed to make typescript work)
interface IState {
  partyName: string,
  displayName: string,
  roomCode: string,
  inRoom: string[],
  queue: string[],
  joinPartyCode: string
}

// Interace for properties of component (needed to make typescript work)
interface IProps {}

class App extends Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    // Set initial state
    this.state = {
      partyName: '',
      displayName: '',
      roomCode: '',
      inRoom: ['salad'],
      queue: [],
      joinPartyCode: ''
    };

    // Bind class methods
    this.setPartyName = this.setPartyName.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
    this.setRoomCode = this.setRoomCode.bind(this);
    this.setInRoom = this.setInRoom.bind(this);
    this.setQueue = this.setQueue.bind(this)
    this.setJoinPartyCode = this.setJoinPartyCode.bind(this);
  }

  // Setters
  setPartyName = (event: any) => {
    this.setState({partyName: event.target.value});
  }

  setDisplayName = (event: any) => {
    this.setState({displayName: event.target.value})
  }

  setRoomCode = (code: string) => {
    this.setState({roomCode: code})
  }

  setInRoom = (userList: string[]) => {
    this.setState({inRoom: userList})
  }

  setQueue = (q: string[]) => {
    this.setState({queue: q})
  }

  setJoinPartyCode = (event: any) => {
    this.setState({joinPartyCode: event.target.value})
  }

  // Supposedly updates display of members in the room when the state updates
  // componentDidUpdate = (prevProps: any, prevState: any) => {
  //   if (window.location.pathname === '/party' && 
  //       document.getElementById("inRoom") !== null &&
  //       this.state.inRoom !== prevState.inRoom) {
  //     console.log(this.state.inRoom)
  //     // document.getElementById("inRoom")!.innerHTML = this.state.inRoom.join(" ");
  //   }
  // }

  // Code for landing page (where you pick host or join party)
  Landing = () => {
    // Initializes sportify authorization flow by prompting user to approve the app to use their
    // Spotify account
    let login = () => {
      sp.getAuthCode();
    }

    let toJoinParty = () => {
      // this.context.router.history.push('/join_party')
    }

    // take out later
    let playSong = () => {
      dc.playSong('123456', 'gods plan')
    }

    return(
      <div className = "main-title">
          <h1>Welcome to Auxy</h1>

          <span>
            <button className="main" type = "button" onClick={login}>
              Host
            </button>
            <button className="main" type = "button" onClick={toJoinParty}>
              Join
            </button>
          </span>
      </div>
    );
  }

  // Where ther user is returned after approving the app to use theri Spotify account.
  // Host names their party and chooses their display name
  CallBack = () => {
    let sendPartyInfo = () => {
      dc.createRoom(this.state.partyName, this.state.displayName, authCode)
        .then(data => {
          this.setRoomCode(data['created_room_code']);
          let population = this.state.inRoom
          population.push(this.state.displayName)
          this.setInRoom(population)
          console.log(this.state.roomCode)
        })
    }

    return(
      <div className="host">
        <header>Welcome to AUXY!</header>
        <form method="POST" action="php/zhuce.php">
            <h5> Please input your name </h5>
            <section>
                <input type="text" value={this.state.displayName} onChange={this.setDisplayName} name="screenname" className="inp" placeholder="Screen Name" />
            </section>
            <h5> What do you want to name your party? </h5>
            <section>
                <input type="text" value={this.state.partyName} onChange={this.setPartyName} name="partyname" className="inp" placeholder="Party Name" />
            </section>
            <section>
              <button onClick={sendPartyInfo}><Link to='/party'>
                party time B-)
              </Link></button>
            </section>
        </form>
      </div>
    );
  }

  // Main room where users in the room can see who's there, the queue, and search for songs (maybe)
  PartyRoom = () => {
    // setInterval(() => {
    //   if (this.state.roomCode !== "") {
    //     dc.getRoomUsers(this.state.roomCode)
    //     .then(data => {
    //       console.log(data)
    //       let displaynames = []

    //       displaynames.push(data['host']['display_name'])

    //       var userList = data['users']
    //       for (var i = 0; i < userList.length; i++) {
    //         displaynames.push(userList[i]['display_name'])
    //       }

    //       console.log(displaynames)
    //       this.setInRoom(displaynames)
    //     })
    //   }
    // }, 1000)

    return(
      <div>
        its a party
        <br />
        <p id='inRoom'>{this.state.inRoom.join(" ")}</p>
      </div>
    )
  }

  // Page for a user to join a party via room code
  JoinParty = () => {
    let attemptToJoin = () => {
      // this.context.history.push('/party')
    }

    return(
      <div className='host'>
        <header>Welcome to AUXY!</header>
        <form method="POST" action="php/zhuce.php">
            <h5> Please input your name </h5>
            <section>
                <input type="text" value={this.state.displayName} onChange={this.setDisplayName} name="screenname" className="inp" placeholder="Screen Name" />
            </section>
            <h5> Party code </h5>
            <section>
                <input type="text" value={this.state.joinPartyCode} onChange={this.setJoinPartyCode} name="partycode" className="inp" placeholder="Party Code" />
            </section>
            <section>
              <button onClick={attemptToJoin}>
                Join Party
              </button>
            </section>
        </form>
      </div>
    )
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={this.Landing} />
          <Route exact path="/callback" component={this.CallBack} />
          <Route exact path="/party" component={this.PartyRoom} />
          <Route exact path="/join_party" component={this.JoinParty} />
        </div>
      </Router>
    );
  }
}

export default (App);
