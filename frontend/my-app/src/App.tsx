import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import SpotifyLogin from './SpotifyLogin';
import DjangoCalls from './DjangoCalls';

interface IState {
  value: string;
}

interface IProps {}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event:any) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  Landing = () => {
    let login = () => {
      let sp = new SpotifyLogin()
      let tokenSub = sp.getToken().subscribe(token => console.log(token));
      sp.login();
      setTimeout(() => console.log(sp.token), 15000)
    }

    let playSong = () => {
      let dc = new DjangoCalls()
      dc.playSong('123456', this.state.value)
    }

    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button onClick={login}>Spotify Login</button>
          <input type='text' value={this.state.value} onChange={this.handleChange}></input>
          <button onClick={playSong}>Play a song</button>
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

  CallBack() {
    let extractToken = () => {
      let token = window.location.hash;
      token = token.substring(token.indexOf("=")+1, token.indexOf("&"));
      alert(token);
    }

    return(
      <div className="App">
        <h2>Congratualation, you signed into spotify!</h2>
        <button onClick={extractToken}>Go back to Auxy</button>
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
