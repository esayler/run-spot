const playlists = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_PLAYLISTS':
      return Object.assign({}, state, { userPlaylists: state.concat(action.data) })
    case 'SET_ACTIVE_PLAYLIST':
      return Object.assign({}, state, { activePlaylist: action.data })
    default:
      return state
  }
}

export default playlists
