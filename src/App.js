import React, { Component } from 'react'
import clientAuth from './clientAuth'
import LogIn from './Login'
import SignUp from './SignUp'
import Explore from './Explore'
import ExploreLoggedIn from './ExploreLoggedIn'
import AccountPreferences from './AccountPreferences'
import CanvasLoggedOut from './CanvasLoggedOut'
import CanvasLoggedIn from './CanvasLoggedIn'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state ={
      currentUser: null,
      loggedIn: false,
      view: 'home'
    }
  }

  componentDidMount(){
    const currentUser = clientAuth.getCurrentUser()
    this.setState({
      currentUser: currentUser,
      loggedIn: !!currentUser,
      view: 'draw'
    })
  }

  _signUp(newUser) {
    clientAuth.signUp(newUser).then((data) =>{
      this.setState({
        currentUser: newUser,
        loggedIn: true,
        view: 'draw'
      })
    })
  }

  _logIn(credentials) {
    clientAuth.logIn(credentials).then(user => {
        this.setState({
          currentUser: user,
          loggedIn: true,
          view: 'draw'
        })

    })
  }

  _logOut() {
    clientAuth.logOut().then(message => {
      this.setState({
        currentUser: null,
        loggedIn: false,
        view: 'draw'
      })
    })
  }

  _setView(evt) {
    evt.preventDefault()
    const view = evt.target.name
    this.setState({
      view: view
    })

  }

  _accountPref(user){
    clientAuth.updateCurrentUser(user,this.state.currentUser).then(res => {
      this.setState({
        currentUser: res.data.user,
        view:'draw'
      })
    })
  }

  render() {

    return (
      <div>
        <nav className="App-nav">
          <span>Draw Somethin'</span>
          {this.state.loggedIn ? this.state.currentUser.name : ''}
          <button name='draw' onClick={this._setView.bind(this)}>Drawing Board</button>
          <button name='explore' onClick={this._setView.bind(this)}>Explore</button>
          {!this.state.loggedIn && (
            <button name='signup' onClick={this._setView.bind(this)}>Sign Up</button>
          )}
          {!this.state.loggedIn && (
            <button name='login' onClick={this._setView.bind(this)}>Log In</button>
          )}
          {this.state.loggedIn && (
            <button name='accountpref' onClick={this._setView.bind(this)}>Account Preferences</button>
          )}
          {this.state.loggedIn && (
            <button name='logout' onClick={this._logOut.bind(this)}>Log Out</button>
          )}
        </nav>

        <div className="container">
        {{
          login: <LogIn onLogin={this._logIn.bind(this)} />,
          signup: <SignUp onSignup={this._signUp.bind(this)} />,
          accountpref: <AccountPreferences onAccountPref={this._accountPref.bind(this)}/>,
          draw: this.state.loggedIn ? <CanvasLoggedIn /> : <CanvasLoggedOut />,
          explore:this.state.loggedIn ? <ExploreLoggedIn /> : <Explore />
        }[this.state.view]}
      </div>
      </div>
    );
  }
}

export default App;
