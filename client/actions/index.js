import axios from 'axios'
import {addNotification as notify} from 'reapop'

export const appendPlaylists = (offset, limit) => (dispatch, getState) => {
  let dispatchOffset = offset || 0
  let dispatchLimit = limit || 50
  const { playlists } = getState()
  // console.log('playlists', playlists)
  if (playlists.length > 0) {
    return
  }
  return dispatch({
    type: 'APPEND_PLAYLISTS',
    payload:
        axios.get(`http://localhost:8000/api/playlists/${dispatchOffset}/${dispatchLimit}`)
        .then(res => {
          // console.log('appendPlaylistsStatus: ', res.status)
          const meta = { offset: res.data.offset, limit: res.data.limit, total: res.data.total }
          const data = res.data.items.map((playlist) => Object.assign({}, { id: playlist.id, name: playlist.name, owner: playlist.owner.id, total: playlist.tracks.total }))
          return Object.assign({}, {meta}, {data})
        }
      ),
  })
}

export const appendTracks = (ownerId, playlistId, offset, limit) => (dispatch, getState) => {
  let dispatchOffset = offset || 0
  let dispatchLimit = limit || 100
  return dispatch({
    type: 'APPEND_TRACKS',
    payload:
    axios.get(`http://localhost:8000/api/tracks/${ownerId}/${playlistId}/${dispatchOffset}/${dispatchLimit}`)
      .then(res => {
        // console.log('appendTracksStatus ', res.status)
        const meta = { offset: 0, limit: 100, total: 'NA' }
        const data = res.data.items.map(({track}) => Object.assign({}, {
          id: track.id,
          album: track.album.name,
          artist: track.artists[0].name,
          name: track.name }))
        return Object.assign({}, {data})
      }
    ),
  }).then(res => {
    res.value.data.map(track => {
      dispatch(getAudioFeaturesForTrack(track.id))
    })
  })
}
// .then(res => dispatch(sortTracksDesc))

export const getAudioFeaturesForTrack = (trackId) => (dispatch, getState) => {
  return dispatch({
    type: 'ADD_AUDIO_FEATURES',
    payload: axios.get(`http://localhost:8000/api/audiofeatures/${trackId}`)
               .then(res => {
                //  console.log('appendTracksStatus ', res.status)
                 return res.data
               }
             ).catch(error => console.log(error.response)),
  })
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

export const createNewPlaylist = () => (dispatch, getState) => {
  const { customPlaylist } = getState()
  console.log('customPlaylist.tracks: ', customPlaylist.tracks)
  const trackIds = customPlaylist.tracks.map(track => 'spotify:track:' + track.id)
  console.log('trackIds: ', trackIds)
  dispatch({
    type: 'CREATE_NEW_PLAYLIST',
    payload: axios.post(`http://localhost:8000/api/create/`, {
      uris: trackIds,
    }).then(res => {
      console.log('CREATE_NEW_PLAYLIST: ', res)
      dispatch(notify({ message: 'Successfully Created New Playlist!', position: 'tc', status: 'success' }))
    }).catch(err => {
      console.log(err)
      dispatch(notify({ message: 'Problem Creating Playlist', position: 'tc', status: 'error' }))
    }),
  })
}

export const sortTracksDesc = () => (dispatch, getState) => {
  const { customPlaylist } = getState()
  const { tracks } = customPlaylist
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_DESC',
    tracks,
  })
}

export const getActiveUser = () => (dispatch, getState) => {
  dispatch({
    type: 'GET_ACTIVE_USER',
    payload: axios.get('http://localhost:8000/api/me/'),
              //  .then(res => { this.props.setActiveUser(res.data.body) })
  }).then(res => {
    console.log(res)
    dispatch(notify({ message: 'Succesfully Logged in', position: 'tc', status: 'success' }))
    dispatch(setActiveUser(res.value.data.body))
  }).catch(err => {
    dispatch(notify({ message: 'Error Logging In!', position: 'tc', status: 'error' }))
    console.log(err)
  })
}
