import { combineReducers } from 'redux'
import playlists from './playlistsReducer'
import { reducer as sematable } from 'sematable'
import tracks from './tracksReducer'
import customPlaylist from './customPlaylist'
import audioFeatures from './audioFeatures'
import user from './userReducer'
import { loadingBarReducer } from 'react-redux-loading-bar'

const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  playlists,
  tracks,
  sematable,
  user,
  audioFeatures,
  customPlaylist,
})

export default rootReducer
