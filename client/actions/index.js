import axios from 'axios'

export const appendPlaylists = (data) => {
  return {
    type: 'APPEND_PLAYLISTS',
    payload:
        axios.get('http://localhost:8000/api/playlists/')
        .then(res =>
          res.data.items.map((playlist) => Object.assign({}, { id: playlist.id, name: playlist.name, owner: playlist.owner.id, total: playlist.tracks.total }))
        ),
  }
}

export const appendTracks = (ownerId, playlistId) => {
  return {
    type: 'APPEND_TRACKS',
    payload:
    axios.get(`http://localhost:8000/api/tracks/${ownerId}/${playlistId}`)
      .then(res =>
        res.data.items.map(({track}) => Object.assign({}, { id: track.id, album: track.album.name, artist: track.artists[0].name, name: track.name }))
    ),
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
