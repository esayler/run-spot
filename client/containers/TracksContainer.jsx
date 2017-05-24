import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import trackActions from '../actions/trackActions'
import playlistActions from '../actions/playlistActions'

import Tracks from '../components/Tracks'
import { makeSelectors } from 'sematable'

const mapStateToProps = (state) => {
  const selectors = makeSelectors('PlaylistTracks')

  return {
    tracks: state.tracks,
    tracksMetaData: state.tracksMetaData,
    sortInfo: selectors.getSortInfo(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    ...trackActions,
    createNewPlaylist: playlistActions.createNewPlaylist,
    setActivePlaylist: playlistActions.setActivePlaylist,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks)
