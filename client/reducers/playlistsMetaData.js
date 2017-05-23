const playlistsMetaData = (state = null, action) => {
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
