import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import playlistActions from '../actions/playlistActions'
import Playlists from '../components/Playlists'

const mapStateToProps = (state) => {
  return {
    playlists: state.playlists.data,
    user: state.user,
    playlistsMetaData: state.playlistsMetaData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(playlistActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
