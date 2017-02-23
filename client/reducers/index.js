import { combineReducers } from 'redux'
import playlists from './playlistsReducer'
import tracks from './tracksReducer'

const rootReducer = combineReducers({
  playlists,
  tracks,
})

export default rootReducer
