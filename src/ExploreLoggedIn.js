import React, { Component } from 'react'
import clientAuth from './clientAuth'
import './App.css'


class ExploreLoggedIn extends Component {
  state = {
    users: [],
    currentUser: null,
    loading: true
  }

  componentDidMount(){
    const currentUser = clientAuth.getCurrentUser()

    clientAuth.getAllUsers().then(res => {
      this.setState({
        users: res.data.drawings,
        currentUser: currentUser,
        loading: false
      })
    })
  }

  render(){
    const exceptCurrent = this.state.users.filter(user => {
      return user.user._id !== this.state.currentUser._id
    })

    const userDrawings = exceptCurrent.map((user, i) => {
			return(
        <div className="Canvas-Images" key={i} >
          <img src={user.url} alt=""/>
        {user.user.name}
      </div>
			)
		})

  return(
    <div>
      <h1>Explore All Drawings</h1>
      <hr/>
      {this.state.loading
        ?<h1> Loading... </h1>
        :userDrawings}
    </div>
    )
  }
}

export default ExploreLoggedIn
