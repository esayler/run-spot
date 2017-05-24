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
    tracks: state.tracks,
    tracksMetaData: state.tracksMetaData,
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
    createNewPlaylist: (playlistName) => {
      dispatch(createNewPlaylist(playlistName))
    },
    resetTracks: () => {
      dispatch(resetTracks())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks)
