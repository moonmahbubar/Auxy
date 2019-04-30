// Spotify authorization functionality based on
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';
import { Redirect } from 'react-router-dom'

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
  partyCode: string,
  searchTerm: string,
  searchResults: any,
  queue: any
  attempt: any,
  redirect: boolean
}

// Interace for properties of component (needed to make typescript work)
interface IProps {}

class App extends Component<IProps, IState> {
  // evtSource: EventSource

  constructor(props: any) {
    super(props);
    // Set initial state
    this.state = {
      partyName: '',
      displayName: '',
      roomCode: '',
      inRoom: ['salad'],
      partyCode: '',
      searchTerm: '',
      searchResults: [],
      queue: [],
      attempt: [],
      redirect: false
    };

    // this.evtSource = dc.getEventSource()
    // this.evtSource.onmessage = (e) => {
    //   // Update the state on recieving info from server
    // }

    // Bind class methods
    this.setPartyName = this.setPartyName.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
    this.setRoomCode = this.setRoomCode.bind(this);
    this.setInRoom = this.setInRoom.bind(this);
    this.setPartyCode = this.setPartyCode.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this);
    this.setQueue = this.setQueue.bind(this);
    this.setAttempt = this.setAttempt.bind(this)
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/party' />
    }
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

  setAttempt = (event: any) => {
    this.setState({attempt: event})
  }

  setPartyCode = (event: any) => {
    this.setState({partyCode: event.target.value})
  }

  setSearchTerm = (event: any) => {
    this.setState({searchTerm: event.target.value})
  }

  setSearchResults = (results: any) => {
    this.setState({searchResults: results})
  }

  setQueue = (newQueue: any) => {
    this.setState({queue: newQueue})
  }

  // Supposedly updates display of members in the room when the state updates
  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (window.location.pathname === '/party' &&
        document.getElementById("inRoom") !== null &&
        this.state.inRoom !== prevState.inRoom) {
      console.log(this.state.inRoom)
      document.getElementById("inRoom")!.innerHTML = this.state.inRoom.join(" ");
    }
  }

  // Code for landing page (where you pick host or join party)
  Landing = () => {
    // Initializes sportify authorization flow by prompting user to approve the app to use their
    // Spotify account
    let login = () => {
      sp.getAuthCode();
    }

    let toJoinParty = () => {
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
        <form method="submit" action="php/zhuce.php">
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
    var count = 0;
    let attemptToJoin = () => {
      fetch('http://localhost:8000/join_room/' + this.state.displayName + '/' + this.state.partyCode)
        .then(response => response.json())
        .then(data => {
          this.setAttempt(data['created_user'])
          count = Object.keys(this.state.attempt).length;
          console.log(this.state.attempt)
          console.log(count)
        if(count === 2){
          console.log("link")
          console.log(count)    
          this.setRedirect()
        }
        else{
          console.log("room empt")
          console.log(count)
          return (
            alert("Room does not exsist.")        
          )
          
        }
      })
    }

    return(
      <div className='host'>{
        this.state.redirect === true ? <Redirect to='/party' push /> : 
        <div>
        <header>Welcome to AUXY!</header>
            <h5> Please input your name </h5>
            <section>
                <input type="text" value={this.state.displayName} onChange={this.setDisplayName} name="screenname" className="inp" placeholder="Screen Name" />
            </section>
            <h5> Party code </h5>
            <section>
                <input type="text" value={this.state.partyCode} onChange={this.setPartyCode} name="partycode" className="inp" placeholder="Party Code" />
            </section>
            <section>
              <button onClick={attemptToJoin}>
              Join Party
              </button>
            </section>
        </div>
      }
    
      </div>
    )
  }

  // Page for a user to join a party via room code
  Playback = () => {
    let addToQueue = (trackId: string, trackName: string, trackArtist: string, trackArt: string, trackLength: string, votes: number) => {
      trackArt = trackArt.slice(24)
      fetch('http://localhost:8000/push_song/123456/' + trackId + '/' + trackName + '/' + trackArtist + '/' + trackArt + '/' + trackLength  + '/0')
    }

    let search = () => {
      fetch('http://localhost:8000/search/123456/' + this.state.searchTerm)
        .then(response => response.json())
        .then(data => {
          this.setSearchResults(data['search_result'])
        })
    }

    let refreshQueue = () => {
      fetch('http://localhost:8000/get_room_queue/123456')
        .then(response => response.json())
        .then(data => {
          this.setQueue(data['songs'])
        })
    }

    refreshQueue();
    return(
      <div className='playback'>
        <h1>Technical Demo of Search and Queue!</h1>
        <form>
          Song name:<br/>
          <button type = "button" onClick={search}>
            Search
          </button>
          <input type="text" value={this.state.searchTerm} onChange={this.setSearchTerm} name="searchterm" className="inp" placeholder="" />
        </form>
        <div>
          {this.state.searchResults.map((r: any) => <button type = "button" onClick={() => addToQueue(r['track_id'],r['track_name'],r['track_artist'],r['track_art'],r['track_length'],0)} key={r['track_id']}>{r['track_name']}</button>)}
        </div>
        <br/>
        <h3>Queue:</h3>
        <div>
          {this.state.queue.map((q: any) => <button type = "button" key={q['track_id']}>{q['track_name']}</button>)}
        </div>
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
          <Route exact path="/playback" component={this.Playback} />
        </div>
      </Router>
    );
  }
}

export default (App);
