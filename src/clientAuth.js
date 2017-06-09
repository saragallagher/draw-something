import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = 'https://desolate-river-36901.herokuapp.com/'|| 'http://localhost:3001'

const clientAuth = {

  setTokenHeader: () => {
    const token = localStorage.getItem('token')
    if(token) {
      axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
    }
  },
  getAllUsers: () => {
    return axios({
      url: '/api/users',
      method: 'get'
    })
  },
  signUp: (userInfo) => {
    return axios({
      url: '/api/users',
      method: 'post',
      data: userInfo
    })
    .then(res => {
      if (res.data.token) {
         localStorage.setItem('token', res.data.token)
         clientAuth.setTokenHeader()
         return jwt_decode(res.data.token)
       } else {
         return false
       }
    })
  },

  logIn: (credentials) => {
    return axios({
      url: '/api/users/login',
      method: 'post',
      data: credentials
    })
    .then(res => {
     if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        clientAuth.setTokenHeader()
        return jwt_decode(res.data.token)
      } else {
        return false
      }

    })
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token')
    return token ? jwt_decode(token) : null
  },

  updateCurrentUser: (updatedUser, currentUser) =>{
    return axios({
      url: `api/users/${currentUser._id}`,
      method: 'patch',
      data: updatedUser
    })
  },
  // deleteCurrentUser: (id) =>{
  //   console.log('current user', id)
  //   return axios({
  //     url: `api/users/${id}`,
  //     method: 'delete'
  //   })
  // },

  logOut: () => {
    return new Promise((resolve) => {
      localStorage.clear()
      delete axios.defaults.headers.common['x-access-token']
      resolve("bye.")
    })
  },

  getDrawing: () => {
    return axios({
      url: 'api/drawings',
      method: 'get'
    })
  },
  getAllDrawings: () => {
    return axios({
      url: 'api/drawings/all',
      method: 'get'
    })
  },

  addDrawing: (newDrawing) => {
    console.log("New Drawing", newDrawing)
    return axios({
      url: '/api/drawings',
      method: 'post',
      data: newDrawing
    })
  },

  updateDrawing: (updatedDrawing) => {
    console.log(updatedDrawing.id)
    return axios({
      url: `/api/drawings/${updatedDrawing.id}`,
      method: 'patch',
      data: updatedDrawing
    })

  },

  deleteDrawing: (id) =>{
    return axios({
      url: `/api/drawings/${id}`,
      method: 'delete'
    })
  }
}


clientAuth.setTokenHeader()
export default clientAuth
