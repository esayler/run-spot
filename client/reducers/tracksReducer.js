const tracks = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_TRACKS_PENDING':
      return Object.assign({}, state, { playlistTracks: [], isPending: true })
    case 'APPEND_TRACKS_FULFILLED':
      return Object.assign({}, state, { playlistTracks: action.payload, isPending: false })
    case 'APPEND_TRACKS_REJECTED':
      return {
        isRejected: true,
        error: action.payload,
      }
    case 'APPEND_TRACKS':
      return action.data
    default:
      return state
  }
}

export default tracks
