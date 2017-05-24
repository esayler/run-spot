import { addNotification as notify } from 'reapop'
import { checkStatus, parseJSON } from '../../utils/fetchUtils'
import fetch from 'isomorphic-fetch'
var Promise = require('bluebird')
const uuidV4 = require('uuid/v4')

export const appendPlaylists = () => (dispatch, getState) => {
  let { user, playlistsMetaData: meta } = getState()

  const limit = 50
  const offset = meta.offset + meta.limit

  if (user && meta.next && meta.offset + meta.limit < meta.total) {
    dispatch({
      type: 'APPEND_PLAYLISTS',
      payload: fetch(`/api/get_playlists?offset=${offset}&limit=${limit}`)
        .then(checkStatus)
        .then(parseJSON)
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
          const data = payload.items.map(playlist =>
            Object.assign(
              {},
              {
                id: playlist.id,
                name: playlist.name,
                owner: playlist.owner.id,
                total: playlist.tracks.total,
              }
            )
          )
          return Object.assign({}, { meta }, { data })
        }),
    })
    .catch(err => {
      dispatch(
        notify({
          title: 'Error getting playlists',
          message: err,
          position: 'tc',
          status: 'error',
        })
      )
    })
  } else if (user) {
    dispatch(
      notify({
        message: 'No More Playlists to Add!',
        position: 'tc',
        status: 'warning',
      })
    )
  }
}

export const appendTracks = (ownerId, playlistId) => (dispatch, getState) => {
  const { user, tracksMetaData: meta } = getState()
  let limit = 50
  let offset = meta ? meta.offset + limit : 0

  if ((user && !meta) || meta.offset + meta.limit < meta.total) {
    return dispatch({
      type: 'APPEND_TRACKS',
      payload: fetch(`/api/tracks/${ownerId}/${playlistId}/${offset}/${limit}`)
        .then(checkStatus)
        .then(parseJSON)
        .then(payload => {
          const meta = {
            next: payload.next,
            offset: payload.offset,
            limit: payload.limit,
            total: payload.total,
          }
          dispatch({
            type: 'SET_TRACKS_META_DATA',
            data: meta,
          })

          const { activePlaylist } = getState()

          const data = payload.items.map(({ track }) =>
            Object.assign(
              {},
              {
                ...activePlaylist,
                id: track.id,
                uuid: uuidV4(),
                album: track.album.name,
                artist: track.artists[0].name,
                name: track.name,
              }
            )
          )
          return Object.assign({}, { data })
        }),
    })
      .then(res => {
        return Promise.all(
          res.value.data.map(track => {
            return dispatch(getAudioFeaturesForTrack(track.id))
          })
        )
      })
      .then(res => {
        const { customPlaylist } = getState()
        if (customPlaylist.sortDirection === 'asc') {
          dispatch(sortCustomTracksAsc())
        } else {
          dispatch(sortCustomTracksDesc())
        }
      })
      .catch(err => {
        dispatch(
          notify({
            title: 'Error getting tracks!',
            message: err,
            position: 'tc',
            status: 'error',
          })
        )
      })
  } else if (user) {
    if (!ownerId || !playlistId) {
      dispatch(
        notify({
          message: 'No Playlist Selected to Add Tracks From!',
          position: 'tc',
          status: 'warning',
        })
      )
    } else {
      dispatch(
        notify({
          message: 'No More Tracks to Add!',
          position: 'tc',
          status: 'error',
        })
      )
    }
  }
}

export const getAudioFeaturesForTrack = trackId => (dispatch, getState) => {
  return dispatch({
    type: 'ADD_AUDIO_FEATURES',
    payload: fetch(`/api/audiofeatures/${trackId}`)
      .then(checkStatus)
      .then(parseJSON)
      .then(payload => {
        return payload
      })
      .catch(error =>
        dispatch(
          notify({
            title: `Error fetching audio features for track ${trackId}`,
            message: error,
            position: 'tc',
            status: 'error',
          })
        )
      ),
  })
}

export const setActiveUser = data => {
  return {
    type: 'SET_ACTIVE_USER',
    data,
  }
}

export const setActivePlaylist = (playlistName, playlistId, userId, total) => (
  dispatch,
  getState
) => {
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

export const createNewPlaylist = playlistName => (dispatch, getState) => {
  const { customPlaylist } = getState()
  const name = playlistName || 'New Custom Playlist'
  const trackIds = customPlaylist.tracks.map(
    track => 'spotify:track:' + track.id
  )
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
    payload: fetch(`/api/playlists`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(payload => {
        dispatch(
          notify({
            allowHTML: true,
            closeButton: true,
            dismissAfter: 10000,
            message: `Succesfully Created New Playlist: 
                          <a href="${payload.external_urls.spotify}"
                            target="_blank"
                          >
                            ${payload.name}
                          </a>`,
            position: 'tc',
            status: 'success',
          })
        )
        Promise.mapSeries(trackArrays, trackIds => {
          fetch(`/api/add/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              href: payload.href,
              uris: trackIds,
            }),
          })
            .then(res => {
              dispatch(
                notify({
                  message: 'Successfully Added Tracks to Playlist',
                  position: 'tc',
                  status: 'success',
                })
              )
            })
            .catch(err => {
              dispatch(
                notify({
                  title: 'Problem Adding Tracks to Playlist!',
                  message: `${err}`,
                  position: 'tc',
                  status: 'error',
                })
              )
            })
        })
      })
      .catch(err => {
        dispatch(
          notify({
            title: 'Problem Creating Playlist',
            message: err,
            position: 'tc',
            status: 'error',
          })
        )
      }),
  })
}

export const sortCustomTracksDesc = () => (dispatch, getState) => {
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_DESC',
  })
}

export const sortCustomTracksAsc = () => (dispatch, getState) => {
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_ASC',
  })
}

export const getActiveUser = () => (dispatch, getState) => {
  return dispatch({
    type: 'GET_ACTIVE_USER',
    payload: fetch('/api/me/')
      .then(checkStatus)
      .then(parseJSON)
      .then(payload => {
        return Promise.all([
          dispatch(setActiveUser(payload.body)),
          dispatch(
            notify({
              message: 'Succesfully Logged in',
              position: 'tc',
              status: 'success',
            })
          ),
        ])
      })
      .catch(err => {
        dispatch(
          notify({
            title: 'Please Login!',
            message: `${err}`,
            position: 'tc',
            status: 'warning',
          })
        )
      }),
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
