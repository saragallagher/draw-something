import React, { Component } from 'react'
import clientAuth from './clientAuth'
import './App.css'


class Explore extends Component {
  state = {
    loading: true,
    users: []
  }
  componentDidMount(){
    clientAuth.getAllUsers().then(res => {
      this.setState({
        loading: false,
        users: res.data.drawings
      })
    })
  }
  render(){
    const userDrawings = this.state.users.map((user, i) => {
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
        ?<h1>Loading...</h1>
        :userDrawings
      }
    </div>

    )
  }
}

export default Explore
