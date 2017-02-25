const playlists = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_PLAYLISTS_PENDING':
      return Object.assign({}, state, { userPlaylists: [], isPending: true })
    case 'APPEND_PLAYLISTS_FULFILLED':
      return Object.assign({}, state, { userPlaylists: action.payload, isPending: false })
    case 'APPEND_PLAYLISTS_REJECTED':
      return {
        isRejected: true,
        error: action.payload,
      }
    case 'SET_ACTIVE_PLAYLIST':
      return Object.assign({}, state, { activePlaylist: action.data })
    default:
      return state
  }
}

export default playlists
