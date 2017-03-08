import { connect } from 'react-redux'

import {
  setActivePlaylist,
  appendTracks,
  createNewPlaylist,
  resetTracks } from '../actions'

import Tracks from '../components/Tracks'
import { makeSelectors } from 'sematable'

const mapStateToProps = (state) => {
  const selectors = makeSelectors('PlaylistTracks')

  return {
    // activePlaylist: state.activePlaylist,
    tracks: state.tracks,
    sortInfo: selectors.getSortInfo(state),
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
    createNewPlaylist: () => {
      dispatch(createNewPlaylist())
    },
    resetTracks: () => {
      dispatch(resetTracks())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks)
