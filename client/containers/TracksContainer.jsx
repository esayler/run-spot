import { connect } from 'react-redux'
import { setActiveUser, setActivePlaylist, appendTracks } from '../actions'
import Tracks from '../components/Tracks'

const mapStateToProps = (state) => {
  return {
    activePlaylist: state.playlists.activePlaylist,
    tracks: state.tracks,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    setActivePlaylist: (data) => {
      dispatch(setActivePlaylist(data))
    },
    appendTracks: (data) => {
      dispatch(appendTracks(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks)
