import axios from 'axios'
import {addNotification as notify} from 'reapop'
import fetch from 'isomorphic-fetch'
var Promise = require('bluebird')

export const appendPlaylists = () => (dispatch, getState) => {
  let { playlistsMetaData } = getState()

  const dispatchLimit = 50
  const dispatchOffset = playlistsMetaData.offset + playlistsMetaData.limit

  if (playlistsMetaData.next && playlistsMetaData.offset + playlistsMetaData.limit < playlistsMetaData.total) {
    dispatch({
      type: 'APPEND_PLAYLISTS',
      payload: fetch(`http://localhost:8000/api/get_playlists?offset=${dispatchOffset}&limit=${dispatchLimit}`)
                  .then(res => res.json())
                  .then(payload => {
                    const meta = {
                      next: payload.next,
                      offset: payload.offset,
                      limit: payload.limit,
                      total: payload.total,
                    }
                    dispatch({
                      type: 'SET_PLAYLISTS_META_DATA',
                      data: meta,
                    })
                    const data = payload.items.map((playlist) => Object.assign({}, {
                      id: playlist.id,
                      name: playlist.name,
                      owner: playlist.owner.id,
                      total: playlist.tracks.total,
                    }))
                    return Object.assign({}, {meta}, {data})
                  }),
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
        const meta = {
          next: res.data.next,
          offset: res.data.offset,
          limit: res.data.limit,
          total: res.data.total,
        }
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
          name: track.name,
        }))
        return Object.assign({}, {data})
      }),
    }).then(res => {
      return Promise.all(res.value.data.map(track => {
        return dispatch(getAudioFeaturesForTrack(track.id))
      }))
    }).then(res => {
      const { customPlaylist } = getState()
      if (customPlaylist.sortDirection === 'asc') {
        dispatch(sortCustomTracksAsc())
      } else {
        dispatch(sortCustomTracksDesc())
      }
      console.log('get all Audio features .then res: ', res)
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

export const setActivePlaylist = (playlistName, playlistId, userId, total) => (dispatch, getState) => {
  dispatch({
    type: 'SET_TRACKS_META_DATA',
    data: null,
  })

  dispatch({
    type: 'SET_ACTIVE_PLAYLIST',
    playlistName,
    playlistId,
    userId,
    total,
  })
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

        Promise.mapSeries(trackArrays, (trackIds) => {
          axios.post(`http://localhost:8000/api/add/`, {
            href: res.data.href,
            uris: trackIds,
          })
          .then(res => {
            console.log('createNewPlaylist api/add/ POST -- res:', res)
            dispatch(notify({ message: 'Successfully Added Tracks to Playlist', position: 'bc', status: 'success' }))
          })
          .catch(err => {
            console.log(err)
            dispatch(notify({ title: 'Problem Adding Tracks to Playlist!', message: '', position: 'tc', status: 'error' }))
          })
        })
      })
      .catch(err => {
        console.log('createNewPlaylist api/new/ POST -- err: ', err)
        dispatch(notify({ title: 'Problem Creating Playlist', message: err, position: 'tc', status: 'error' }))
      }),
  })
}

export const sortCustomTracksDesc = () => (dispatch, getState) => {
  // const { customPlaylist } = getState()
  // const { tracks } = customPlaylist
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_DESC',
  })
}

export const sortCustomTracksAsc = () => (dispatch, getState) => {
  // const { customPlaylist } = getState()
  // const { tracks } = customPlaylist
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_ASC',
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
