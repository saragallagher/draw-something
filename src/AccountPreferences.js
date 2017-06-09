import React, { Component } from 'react'
import clientAuth from './clientAuth'

class AccountPreferences extends Component {
  state ={
    currentUser: null,
  }

  componentDidMount(){
    const currentUser = clientAuth.getCurrentUser()
      this.setState({
        currentUser: currentUser,
      })
  }

  _handleUpdate(evt){
    evt.preventDefault()
    const updatedUser = {
      name: this.refs.name.value,
      email: this.refs.email.value,
    }
    this.props.onAccountPref(updatedUser)
  }
  //
  // _handleDelete(evt){
  //   evt.preventDefault()
  //   console.log('are you sure?', this.state.currentUser._id)
  //   clientAuth.deleteCurrentUser(this.state.currentUser._id).then(res => {
  //     return(
  //       <h1> BYE </h1>
  //     )
  //   })
  // }

  render(){
    return(
      <div className='container'>
        <h2>Update Account</h2>
        <form onSubmit={this._handleUpdate.bind(this)}>
          <input type='text' placeholder='Full Name' ref='name' />
          <input type='text' placeholder='Email' ref='email' />
          <button type='submit'>Update Account</button>
          {/* <button onClick={this._handleDelete.bind(this)}>Delete Account?</button> */}
        </form>
      </div>
    )
  }
}

export default AccountPreferences
