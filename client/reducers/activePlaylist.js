const activePlaylist = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_PLAYLIST':
      const { playlistName, playlistId, userId, total } = action
      return {
        playlistName,
        playlistId,
        userId,
        total,
      }
    default:
      return state
  }
}

export default activePlaylist
