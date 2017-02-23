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
