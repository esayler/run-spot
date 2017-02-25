import { connect } from 'react-redux'
import { setActiveUser, setActivePlaylist, appendTracks } from '../actions'
import Tracks from '../components/Tracks'

const mapStateToProps = (state) => {
  return {
    activePlaylist: state.playlists.activePlaylist,
    tracks: state.tracks.playlistTracks,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActivePlaylist: (data) => {
      dispatch(setActivePlaylist(data))
    },
    appendTracks: (ownerId, playlistId) => {
      dispatch(appendTracks(ownerId, playlistId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks)
