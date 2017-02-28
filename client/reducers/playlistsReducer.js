const playlists = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_PLAYLISTS_PENDING':
      return state
    case 'APPEND_PLAYLISTS_FULFILLED':
      return action.payload
    case 'APPEND_PLAYLISTS_REJECTED':
      return state
    case 'SET_ACTIVE_PLAYLIST':
      return state
    default:
      return state
  }
}

export default playlists
