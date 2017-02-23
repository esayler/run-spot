import { connect } from 'react-redux'
import { appendPlaylists } from '../actions'
import Playlists from '../components/Playlists'

const mapStateToProps = (state) => {
  return { userPlaylists: state.playlists.userPlaylists }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appendPlaylists: (data) => {
      dispatch(appendPlaylists(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists)
