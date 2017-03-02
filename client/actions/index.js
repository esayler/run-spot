import axios from 'axios'
import {addNotification as notify} from 'reapop'

export const appendPlaylists = () => (dispatch, getState) => {
  const { playlists } = getState()
  const { playlistsMetaData } = getState()

  let dispatchLimit = 50
  let dispatchOffset = playlistsMetaData ? playlistsMetaData.offset + dispatchLimit : 0
  if (!playlistsMetaData || (playlistsMetaData.offset + playlistsMetaData.limit < playlistsMetaData.total)) {
    return dispatch({
      type: 'APPEND_PLAYLISTS',
      payload:
          axios.get(`http://localhost:8000/api/playlists/${dispatchOffset}/${dispatchLimit}`)
          .then(res => {
            const meta = { next: res.data.next, offset: res.data.offset, limit: res.data.limit, total: res.data.total }
            dispatch({
              type: 'SET_PLAYLISTS_META_DATA',
              data: meta,
            })
            const data = res.data.items.map((playlist) => Object.assign({}, { id: playlist.id, name: playlist.name, owner: playlist.owner.id, total: playlist.tracks.total }))
            return Object.assign({}, {meta}, {data})
          }
        ),
    })
  }
}

export const appendTracks = (ownerId, playlistId) => (dispatch, getState) => {
  const { tracksMetaData } = getState()
  let dispatchLimit = 50
  let dispatchOffset = tracksMetaData ? tracksMetaData.offset + dispatchLimit : 0
  if (!tracksMetaData || (tracksMetaData.offset + tracksMetaData.limit < tracksMetaData.total)) {
    return dispatch({
      type: 'APPEND_TRACKS',
      payload:
      axios.get(`http://localhost:8000/api/tracks/${ownerId}/${playlistId}/${dispatchOffset}/${dispatchLimit}`)
      .then(res => {
        const meta = { next: res.data.next, offset: res.data.offset, limit: res.data.limit, total: res.data.total }
        dispatch({
          type: 'SET_TRACKS_META_DATA',
          data: meta,
        })

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
}

export const getAudioFeaturesForTrack = (trackId) => (dispatch, getState) => {
  return dispatch({
    type: 'ADD_AUDIO_FEATURES',
    payload: axios.get(`http://localhost:8000/api/audiofeatures/${trackId}`)
               .then(res => {
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
  const trackIds = customPlaylist.tracks.map(track => 'spotify:track:' + track.id)
  dispatch({
    type: 'CREATE_NEW_PLAYLIST',
    payload: axios.post(`http://localhost:8000/api/create/`, {
      uris: trackIds,
    }).then(res => {
      dispatch(notify({ message: 'Successfully Created New Playlist!', position: 'tc', status: 'success' }))
    }).catch(err => {
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
    dispatch(notify({ message: 'Succesfully Logged in', position: 'tc', status: 'success' }))
    dispatch(setActiveUser(res.value.data.body))
  }).catch(err => {
    dispatch(notify({ message: 'Error Logging In!', position: 'tc', status: 'error' }))
  })
}
