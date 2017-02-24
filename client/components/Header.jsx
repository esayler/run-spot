import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

export default class Header extends React.Component {

  handleLogin() {
    preventDefault()
  }

  componentDidMount() {
    axios.get('http://localhost:8000/api/me/')
      .then(res => {
        this.props.setActiveUser(res.data.body)
      })
  }

  render() {
    const user = this.props.activeUser
      ? <div className='user-profile-display'>{this.props.activeUser.id}</div>
      : <Link onClick={this.handleLogin.bind(this)} to='/api/auth/spotify' className='btn btn-login'>Login</Link>

    return (
      <div className='header'>
        <Link to='/' className='hello-link'><h1>rn.spt</h1></Link>

        <nav className='navbar'>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/playlists'>Playlists</Link>
          <Link to='/tracks'>Tracks</Link>
          {user}
        </nav>
      </div>
    )
  }
}
