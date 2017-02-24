export const appendPlaylists = (data) => {
  return {
    type: 'APPEND_PLAYLISTS',
    data,
  }
}

export const appendTracks = (data) => {
  return {
    type: 'APPEND_TRACKS',
    data,
  }
}

export const setActiveUser = (data) => {
  return {
    type: 'SET_ACTIVE_USER',
    data,
  }
}

export const setActivePlaylist = (data) => {
  return {
    type: 'SET_ACTIVE_PLAYLIST',
    data,
  }
}
