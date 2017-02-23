import React from 'react'
import Home from './Home'
import Tracks from './Tracks'
import About from './About'
// import NotFound from './NotFound'
import PlaylistsContainer from '../containers/PlaylistsContainer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from '../reducers'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(rootReducer, devTools)

const handleLogin = () => {
  preventDefault()
}

const Root = () => (
  <Provider store={store}>
    <Router>
      <div className='app'>
        <div className='header'>
          <Link to='/' className='hello-link'><h1>rn.spt</h1></Link>

          <nav className='navbar'>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/playlists'>Playlists</Link>
            <Link to='/tracks'>Tracks</Link>
            <Link onClick={handleLogin} to='/api/auth/spotify' className='btn btn-login'>Login</Link>
          </nav>
        </div>

        <div className='content'>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/playlists' component={PlaylistsContainer} />
          <Route path='/tracks' component={Tracks} />
          <Route path='/api/auth/spotify' render={() => {}} />
        </div>
      </div>
    </Router>
  </Provider>
)

export default Root
