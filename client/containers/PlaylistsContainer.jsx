import { connect } from 'react-redux'
import { appendPlaylists } from '../actions'
import Playlists from '../components/Playlists'

const mapStateToProps = (state) => {
  return { userPlaylists: state.playlists.userPlaylists }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appendPlaylists: () => {
      dispatch(appendPlaylists())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
