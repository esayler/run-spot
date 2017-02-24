import { combineReducers } from 'redux'
import playlists from './playlistsReducer'
import { reducer as sematable } from 'sematable'
import tracks from './tracksReducer'
import user from './userReducer'

const rootReducer = combineReducers({
  playlists,
  tracks,
  sematable,
  user,
})

export default rootReducer
