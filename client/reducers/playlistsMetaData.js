const playlistsMetaData = (state = { offset: -50, limit: 50, total: 999, next: true }, action) => {
  switch (action.type) {
    case 'SET_PLAYLISTS_META_DATA':
      return action.data
    case 'REMOVE_PLAYLISTS_META_DATA':
      return action.data
    default:
      return state
  }
}

export default playlistsMetaData
