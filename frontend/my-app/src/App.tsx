// Spotify authorization functionality based on
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';
import LinearProgress from "@material-ui/core/LinearProgress";

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
  searchTerm: string,
  searchResults: any,
  queue: any
  hostToken: string
  attempt: any,
  isHost: boolean,
  hostName: string,
  roomActive: boolean,
  currentlyPlaying: any,
  redirect: boolean,
  redirectToJoinPartyPage: boolean,
  redirectToLanding: boolean,
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
      inRoom: [],
      searchTerm: '',
      searchResults: [],
      queue: [],
      hostToken: '',
      attempt: [],
      isHost: false,
      hostName: '',
      roomActive: true,
      currentlyPlaying: {},
      redirect: false,
      redirectToJoinPartyPage: false,
      redirectToLanding: false,
    };

    // this.evtSource = dc.getEventSource()
    // this.evtSource.onmessage = (e) => {
    //   // Update the state on recieving info from server
    // }

    // Bind class methods
    // this.setPartyName = this.setPartyName.bind(this);
    // this.setDisplayName = this.setDisplayName.bind(this);
    // this.setRoomCode = this.setRoomCode.bind(this);
    // this.setInRoom = this.setInRoom.bind(this);
    // this.setSearchResults = this.setSearchResults.bind(this);
    // this.setQueue = this.setQueue.bind(this);
    // this.setHostToken = this.setHostToken.bind(this);
    // this.setAttempt = this.setAttempt.bind(this);
  }

  // State redirect setters
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

  setRedirectoToJoinPartyPage = () => {
    this.setState({redirectToJoinPartyPage: true})
  }

  setRedirectToLanding = () => {
    this.setState({redirectToLanding: true})
  }

  // Setters
  setPartyName = (name: string) => {
    this.setState({partyName: name});
  }

  setPartyNameFromEvent = (event: any) => {
    this.setState({partyName: event.target.value});
  }

  setDisplayName = (event: any) => {
    this.setState({displayName: event.target.value})
  }

  setRoomCode = (code: string) => {
    this.setState({roomCode: code})
  }

  setRoomCodeFromEvent = (event: any) => {
    this.setState({roomCode: event.target.value})
  }

  setInRoom = (userList: string[]) => {
    this.setState({inRoom: userList})
  }

  setAttempt = (event: any) => {
    this.setState({attempt: event})
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

  setHostToken = (token: string) => {
    this.setState({hostToken: token})
  }

  setAsHost = () => {
    this.setState({isHost: true})
  }

  deactivateRoom = () => {
    this.setState({roomActive: false})
  }

  setHostName = (name: string) => {
    this.setState({hostName: name})
  }

  setCurrentlyPlaying = (playbackObj: any) => {
    this.setState({currentlyPlaying: playbackObj})
  }

  componentDidMount() {
    // If on the party page, fetch room updates every second
    setInterval(() => {
      if (window.location.pathname === "/party" && this.state.roomCode !== "") {
        fetch('http://localhost:8000/get_room_info/' + this.state.roomCode)
          .then(response => response.json())
          .then(data => {
            // console.log(data)
            let displaynames = []

            displaynames.push(data['host']['display_name'])

            var userList = data['users']
            for (var i = 0; i < userList.length; i++) {
              displaynames.push(userList[i]['display_name'])
            }

            // console.log(displaynames)
            this.setInRoom(displaynames)
            this.setHostToken(data['host']['host_token'])
            this.setHostName(data['host']['display_name'])
            this.setPartyName(data['room']['name'])
            this.setQueue(data['queue'])

            //If room has become inactive, reflect in state
            if (!data['room']['is_active']) {
              this.deactivateRoom()
            }
            if (data['current_playback'] !== 'None') {
              this.setCurrentlyPlaying(data['current_playback'])
            }
          })
      }
    }, 1000)
  }

  // Sets up spotify web player when a new host token is recieved
  // Handles user warning
  componentDidUpdate(prevProps: any, prevState: any) {
    // Perform when party page is loaded
    if (window.location.pathname === '/party' && 
        this.state.hostToken !== prevState.hostToken &&
        prevState.hostToken === "") {
      
      // Warn host that they will lose host priviledges if they leave the room
      if (this.state.isHost) {
          window.addEventListener('beforeunload', (e) => {
              // Cancel the event
              e.preventDefault();

            // Chrome requires returnValue to be set
            e.returnValue = 'leave page?';
        });
      }
      

      // Delete user or room depending on if leaving user is the host or not
      window.addEventListener('unload', (e) => {
        // Call endpoint to update backend
        if (this.state.isHost) {
          dc.hostLeaveRoom(this.state.roomCode)
          this.deactivateRoom()
        } else {
          dc.userLeaveRoom(this.state.roomCode, this.state.displayName)
        }
      })

      // console.log(this.state.hostToken)
      // Import Spotify Web Player SDK module
      const moduleScript = document.createElement("script");
      moduleScript.src = "https://sdk.scdn.co/spotify-player.js";
      moduleScript.async = true;

      // Create script element for setting up the spotify web player
      const script = document.createElement("script");
      script.async = true;
      script.innerHTML = `
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = '${this.state.hostToken}';
        const player = new Spotify.Player({
          name: 'AUXY',
          getOAuthToken: cb => { 
            fetch('http://localhost:8000/refresh_token/${this.state.roomCode}').then(response => console.log('Token refreshed'));
            cb(token); 
          }
        });
      
        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });
      
        // Playback status updates
        // player.addListener('player_state_changed', state => { console.log(state); });
      
        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
        });
      
        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });
      
        //listener for checking when a song has ended
        player.addListener(
          'player_state_changed',
          state =>
          {
            console.log(state);
            if(this.state && ! this.state.paused && state.paused && state.position === 0) {
              fetch('http://localhost:8000/pop_song/${this.state.roomCode}').then(response => console.log('Track ended'));
              // setTrackEnd(true);
            }
            this.state = state;
          }
        );
      
        // Connect to the player!
        player.connect();
      };`;
    
      if (this.state.isHost) {
        // Append elements to HTML body
        document.body.appendChild(script);
        document.body.appendChild(moduleScript);
      }
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
      this.setRedirectoToJoinPartyPage()
    }

    // take out later
    let playSong = () => {
      dc.playSong('123456', 'gods plan')
    }

    return(
      <div>
        {
          this.state.redirectToJoinPartyPage ? <Redirect to='/join_party' push /> :
          <div className = "main-title">
            <div className = "box">
              <h1 className="hero-title">Welcome to Auxy!</h1>
              <p className="hero-paragraph">With Auxy, you can collaborate on Spotify queues with your friends! </p>
              <span>
                <button className="main1" type = "button" onClick={login}>
                Host
                </button>
                <button className="main2" type = "button" onClick={toJoinParty}>
                Join
                </button>
              </span>
            </div>
          </div>
        }
      </div>
    );
  }

  // Where ther user is returned after approving the app to use theri Spotify account.
  // Host names their party and chooses their display name
  CallBack = () => {
    let sendPartyInfo = () => {
      if (this.state.displayName === '' || this.state.partyName === '') {
        alert('Display name and party name are required :^|')
      } else {
        dc.createRoom(this.state.partyName, this.state.displayName, authCode)
          .then(data => {
            this.setRoomCode(data['created_room_code']);
            this.setAsHost()
            
            let population = this.state.inRoom
            population.push(this.state.displayName)
            this.setInRoom(population)
          })
      }
    }

    let shameButton = () => {
      // e.preventDefault()
      alert('Display name and party name are required :^|')
    } 

    return(
      <div className="host">
        <header>Welcome to AUXY!</header>
        <form>
            <h5> Please input your name </h5>
            <section>
                <input type="text" value={this.state.displayName} onChange={this.setDisplayName} name="screenname" className="inp" placeholder="Screen Name" />
                { this.state.displayName === "" ? 
                <div className='err-message'>
                  <p>Display name is required</p>
                </div> : <div></div>
                }
            </section>
            <h5> What do you want to name your party? </h5>
            <section>
                <input type="text" value={this.state.partyName} onChange={this.setPartyNameFromEvent} name="partyname" className="inp" placeholder="Party Name" />
                { this.state.partyName === "" ? 
                <div className='err-message'>
                  <p>Party name is required</p>
                </div> : <div></div>
                }
            </section>
            <section>
              {
                this.state.partyName !== '' && this.state.displayName !== '' ?
                <Link to='/party'> 
                  <button onClick={sendPartyInfo}>
                    party time B-)
                  </button> 
                </Link> :
                <button type='button' onClick={shameButton}>
                  party time B-)
                </button> 
              }
            </section>
        </form>
    </div>
    );
  }

  // Main room where users in the room can see who's there, the queue, and search for songs (maybe)
  PartyRoom = () => {
    let addToQueue = (trackId: string, trackName: string, trackArtist: string, trackArt: string, trackLength: string, votes: number) => {
      trackArt = trackArt.slice(24)
      fetch('http://localhost:8000/push_song/' + this.state.roomCode + '/' + trackId + '/' + trackName + '/' + trackArtist + '/' + trackArt + '/' + trackLength  + '/0')
    }

    let removeFromQueue = (auto_increment_id: string) => {
      fetch('http://localhost:8000/remove_song/' + auto_increment_id)
        .then(response => response.json())
        .then(data => {
          console.log(auto_increment_id)
        })
      fetch('http://localhost:8000/songs')
        .then(response => response.json())
        .then(data => {
          console.log(data)
        })
    }

    let search = () => {
      fetch('http://localhost:8000/search/'  + this.state.roomCode + '/' + this.state.searchTerm)
        .then(response => response.json())
        .then(data => {
          this.setSearchResults(data['search_result'])
          console.log(data['search_result'])
        })
    }

    let refreshQueue = () => {
      fetch('http://localhost:8000/get_room_queue/'  + this.state.roomCode)
        .then(response => response.json())
        .then(data => {
          this.setQueue(data['songs'])
        })
    }

    // Redirect user to landing page
    let leaveRoom = () => {
      window.location.href = 'https://auxy.netlify.com/'
    }

    // Calculate the progress through the current song
    let percent = 0
    if (this.state.currentlyPlaying !== {}) {
      let length = this.state.currentlyPlaying["track_length"];
      let progress = this.state.currentlyPlaying["track_progress"];
      percent = (progress / length) * 100;
    }

    // If the room becomes inactive due to the host leaving, alert users and navigate
    // to landing page
    if (!this.state.roomActive) {
      alert("The host has left the party :^(")
      leaveRoom()
    }

    //console.log(this.state)
    return(
        <div className='playback'>
          <b>{this.state.partyName}</b> {this.state.roomCode}
          <button onClick={leaveRoom}>Leave Room</button>
          <br />
          <p id='inRoom'>{this.state.inRoom.join(" ")}</p>

          <div className="dropdown">
            <form className="searchbar" onSubmit={search}>
              <input className="search_input" type="text" placeholder="Search" value={this.state.searchTerm} onChange={this.setSearchTerm} name="searchterm" aria-label="Search"/>
              <button type = "button" onClick={search}><i className="fa fa-search"></i></button> 
            </form>
            <div className="spoop">
            <table className= "searchR">
              {this.state.searchResults.map((r: any) => 
              <tbody>
                <tr key={r['track_id']}>
                    <td>
                      <img src ={r['track_art']} />
                    </td>
                    <td>
                      <p className= "song">{r['track_name']}</p>
                      <p className = "artist">{r['track_artist']}</p>
                    </td>
                    <td className="searchRcol"> 
                    <button className="addBtn" type = "button" onClick={() => addToQueue(r['track_id'],r['track_name'],r['track_artist'],r['track_art'],r['track_length'],0)}> + </button>
                  </td>
                </tr>
              </tbody>
              )}
            </table>
          </div>
        </div>
      
        <div className='progress-bar'>
          <br />
          <LinearProgress variant="determinate" value={percent} />
          <br />
        </div>

        <h3>Queue:</h3>
        <div>
          <table>
          {this.state.queue.map((q: any) =>
          <tbody>
            <tr key={q['track_id']}>
                  <td>
                    <img src ={"https://i.scdn.co/image/"+q['track_art']} />
                  </td>
                  <td>
                    <p className= "song">{q['track_name']}</p>
                    <p className = "artist">{q['track_artist']}</p>
                  </td>
                  <td>
                  <button className="addBtn" type = "button" onClick={() => removeFromQueue(q['auto_increment_id'])}> X </button> 
                  </td>
              </tr>
              </tbody>
          )}
          </table>
          {/* <img src ={this.state.currentlyPlaying['track_art']} /> */}
        </div>
        </div>
    )
  }

  // Page for a user to join a party via room code
  JoinParty = () => {
    var count = 0;
    let attemptToJoin = () => {
      fetch('http://localhost:8000/join_room/' + this.state.displayName + '/' + this.state.roomCode)
        .then(response => response.json())
        .then(data => {
          this.setAttempt(data['created_user'])
          count = Object.keys(this.state.attempt).length;
          console.log(this.state.attempt)
          console.log(count)
          console.log(typeof this.state.attempt[0])
        if (typeof this.state.attempt[0] === 'object') {
          // console.log("link")
          // console.log(count)    
          this.setRedirect()
        }
        else if (this.state.attempt[0] === "Room not found!") {
          // console.log("room empt")
          // console.log(count)
          return (
            alert("Room does not exsist.")        
          )
        }
        else if (this.state.attempt[0] === "Display name is not available!") {
          alert("This display name is in use at the party already.")
        }
      })
    }

    let shameButton = () => {
      // e.preventDefault()
      alert('Display name and room code is required :^|')
    } 

    return(
      <div className='host'>{
        this.state.redirect === true ? <Redirect to='/party' push /> : 
        <div>
        <header>Welcome to AUXY!</header>
            <h5> Please input your name </h5>
            <section>
                <input type="text" value={this.state.displayName} onChange={this.setDisplayName} name="screenname" className="inp" placeholder="Screen Name" />
                { this.state.displayName === "" ? 
                <div className='err-message'>
                  <p>Display name is required</p>
                </div> : <div></div>
                }
            </section>
            <h5> Party code </h5>
            <section>
                <input type="text" value={this.state.roomCode} onChange={this.setRoomCodeFromEvent} name="partycode" className="inp" placeholder="Party Code" />
                { this.state.roomCode === "" ? 
                <div className='err-message'>
                  <p>Room code is required</p>
                </div> : <div></div>
                }
            </section>
            <section>
            {
                this.state.roomCode !== '' && this.state.displayName !== '' ?
                <button onClick={attemptToJoin}>
                  Join Party
                </button> :
                <button type='button' onClick={shameButton}>
                  Join Party
                </button> 
              }
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

    let removeFromQueue = (auto_increment_id: string) => {
      fetch('http://localhost:8000/remove_song/' + auto_increment_id)
        .then(response => response.json())
        .then(data => {
          console.log(auto_increment_id)
        })
      fetch('http://localhost:8000/songs')
        .then(response => response.json())
        .then(data => {
          console.log(data)
        })
    }

    let search = () => {
      fetch('http://localhost:8000/search/123456/' + this.state.searchTerm)
        .then(response => response.json())
        .then(data => {
          this.setSearchResults(data['search_result'])
          console.log(data['search_result'])
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

        <div className="dropdown">
            <form className="searchbar" onSubmit={search}>
              <input className="search_input" type="text" placeholder="Search" value={this.state.searchTerm} onChange={this.setSearchTerm} name="searchterm" aria-label="Search"/>
              <button type = "button" onClick={search}><i className="fa fa-search"></i></button> 
            </form>
            <div className="spoop">
            <table className= "searchR">
              {this.state.searchResults.map((r: any) => 
              <tbody>
                <tr key={r['track_id']}>
                    <td>
                      <img src ={r['track_art']} />
                    </td>
                    <td>
                      <p className= "song">{r['track_name']}</p>
                      <p className = "artist">{r['track_artist']}</p>
                    </td>
                    <td className="searchRcol"> 
                    <button className="addBtn" type = "button" onClick={() => addToQueue(r['track_id'],r['track_name'],r['track_artist'],r['track_art'],r['track_length'],0)}> + </button>
                  </td>
                </tr>
              </tbody>
              )}
            </table>
          </div>
        </div>
      

        <h3>Queue:</h3>
        <div>
          <table>
          {this.state.queue.map((q: any) =>
          <tbody>
            <tr key={q['track_id']}>
                  <td>
                    <img src ={"https://i.scdn.co/image/"+q['track_art']} />
                  </td>
                  <td>
                    <p className= "song">{q['track_name']}</p>
                    <p className = "artist">{q['track_artist']}</p>
                  </td>
                  <td>
                  <button className="addBtn" type = "button" onClick={() => removeFromQueue(q['auto_increment_id'])}> X </button> 
                  </td>
              </tr>
              </tbody>
          )}
          </table>
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
