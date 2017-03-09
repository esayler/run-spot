import axios from 'axios'
import {addNotification as notify} from 'reapop'
import _ from 'lodash'

export const appendPlaylists = () => (dispatch, getState) => {
  const { playlists } = getState()
  const { playlistsMetaData } = getState()

  dispatch({
    type: 'SET_TRACKS_META_DATA',
    data: null,
  })

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
  } else {
    dispatch(notify({ message: 'No More Playlists to Add!', position: 'tc', status: 'error' }))
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
        console.log('tracksResponse', res);
        const meta = { next: res.data.next, offset: res.data.offset, limit: res.data.limit, total: res.data.total }
        dispatch({
          type: 'SET_TRACKS_META_DATA',
          data: meta,
        })

        const { activePlaylist } = getState()

        const data = res.data.items.map(({track}) => Object.assign({}, {
          ...activePlaylist,
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
  } else {
    if (!ownerId || !playlistId) {
      dispatch(notify({ message: 'No Playlist Selected to Add Tracks From!', position: 'tc', status: 'warning' }))
    } else {
      dispatch(notify({ message: 'No More Tracks to Add!', position: 'tc', status: 'error' }))
    }
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

export const setActivePlaylist = (playlistName, playlistId, userId, total) => {
  return {
    type: 'SET_ACTIVE_PLAYLIST',
    playlistName,
    playlistId,
    userId,
    total,
  }
}

export const createNewPlaylist = (playlistName) => (dispatch, getState) => {
  const { customPlaylist } = getState()
  const name = playlistName || 'New Custom Playlist'
  const trackIds = customPlaylist.tracks.map(track => 'spotify:track:' + track.id)
  let trackArrays = []

  // split the custom playlist into 50-track chunks
  for (let i = 0; i < trackIds.length; i += 50) {
    trackArrays.push(trackIds.slice(i, i + 50))
  }

  // reverse the array of arrays so spotify adds the first tracks last
  // (to the top of the playlist) (preserves order)
  trackArrays.reverse()

  dispatch({
    type: 'CREATE_NEW_PLAYLIST',
    payload: axios.post(`http://localhost:8000/api/new/`, { name })
      .then(res => {
        console.log('createNewPlaylist api/new/ POST -- res:', res)
        dispatch(notify({
          allowHTML: true,
          closeButton: true,
          dismissAfter: 10000,
          message: `Succesfully Created New Playlist: <a href="${res.data.external_urls.spotify}" target="_blank">${res.data.name}</a>`,
          position: 'tc',
          status: res.status }))

        trackArrays.map(trackIds => {
          axios.post(`http://localhost:8000/api/add/`, {
            href: res.data.href,
            uris: trackIds,
          })
          .then(res => {
            console.log('createNewPlaylist api/add/ POST -- res:', res)
            dispatch(notify({ message: 'Successfully Added Tracks to Playlist', position: 'bc', status: 'success' }))
          })
          .catch(err => {
            dispatch(notify({ title: 'Problem Adding Tracks To Playlist', message: err, position: 'tc', status: 'error' }))
          })
        })
      })
      .catch(err => {
        console.log('createNewPlaylist api/new/ POST -- err: ', err)
        dispatch(notify({ title: 'Problem Creating Playlist', message: err, position: 'tc', status: 'error' }))
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
    dispatch(notify({ message: 'Please Login!', position: 'tc', status: 'warning' }))
  })
}

export const removeActiveUser = () => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_ACTIVE_USER',
    data: false,
  })
}

export const resetTracks = () => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_TRACKS',
    data: [],
  })

  dispatch({
    type: 'REMOVE_CUSTOM_TRACKS',
  })

  dispatch({
    type: 'SET_TRACKS_META_DATA',
    data: null,
  })
}
