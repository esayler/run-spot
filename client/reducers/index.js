import { combineReducers } from 'redux'
import playlists from './playlistsReducer'
import { reducer as sematable } from 'sematable'
import tracks from './tracksReducer'
import customPlaylist from './customPlaylist'
import audioFeatures from './audioFeatures'
import user from './userReducer'
import playlistsMetaData from './playlistsMetaData'
import { loadingBarReducer } from 'react-redux-loading-bar'
import { reducer as notificationsReducer } from 'reapop'

const rootReducer = combineReducers({
  notifications: notificationsReducer(),
  loadingBar: loadingBarReducer,
  playlists,
  tracks,
  sematable,
  user,
  audioFeatures,
  customPlaylist,
  playlistsMetaData,
})

export default rootReducer
