import React from 'react'
// import Router from 'react-router/BrowserRouter'
// import Match from 'react-router/Match'
// import Link from 'react-router/Link'
// import Miss from 'react-router/Miss'
import Home from './Home'
import GetTracks from './GetTracks'
import About from './About'
import NotFound from './NotFound'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const handleLogin = () => {
  preventDefault()
}

const Root = () => (
  <Router>
    <div className='app'>
      <div className='header'>
        <Link to='/' className='hello-link'><h1>rn.spt</h1></Link>

        <nav className='navbar'>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/missing'>404</Link>
          <Link to='/getTracks'>getTracks</Link>
          <Link onClick={handleLogin} to='/api/auth/spotify' className='btn btn-login'>Login</Link>
        </nav>
      </div>

      <div className='content'>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/getTracks' component={GetTracks} />
        <Route path='/api/auth/spotify' render={() => {}} />
      </div>
    </div>
  </Router>
)

export default Root
