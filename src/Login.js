import React, { Component } from 'react'
import AlertContainer from 'react-alert'

class LogIn extends Component {
  _handleLogin(evt){
    evt.preventDefault()
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onLogin(credentials)
    setTimeout(this.checkForToken.bind(this), 700)
  }

  checkForToken(){
    const token = localStorage.getItem('token')
    if(token){
      console.log('there is a token!')
    } else{
      console.log('nope no token')
      this.msg.show('Invalid Email or Password', {
        time: 5000,
        type: 'error'
      })
    }
  }
  alertOptions ={
    offset: 14,
    postion: 'top left',
    theme: 'dark',
    time: 5000,
    transition: 'fade'
  }
  showAlert = (evt) => {

    evt.preventDefault()
    this.msg.show('Invalid Email or Password', {
      time: 5000,
      type: 'error'
    })
  }
  render(){
    return(
      <div className='container'>
        <h2>Log In</h2>
        <form onSubmit={this._handleLogin.bind(this)}>
          <input type='text' placeholder='Email' ref='email' />
          <input type='password' placeholder='Password' ref='password' />
          <button type='submit'>Log In</button>
          <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
        </form>
      </div>
    )
  }
}

export default LogIn
