import { addNotification as notify } from 'reapop'
import { checkStatus, parseJSON } from '../../utils/fetchUtils'
import fetch from 'isomorphic-fetch'
const Promise = require('bluebird')

const appendPlaylists = () => (dispatch, getState) => {
  let { user, playlistsMetaData: meta } = getState()

  const limit = 50
  const offset = meta.offset + meta.limit

  if (meta.next && meta.offset + meta.limit < meta.total) {
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

const createNewPlaylist = playlistName => (dispatch, getState) => {
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

const setActivePlaylist = (playlistName, playlistId, userId, total) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: 'SET_TRACKS_META_DATA',
    data: null,
  }).then(() => {
    dispatch({
      type: 'SET_ACTIVE_PLAYLIST',
      playlistName,
      playlistId,
      userId,
      total,
    })
  })
}

export default {
  appendPlaylists,
  createNewPlaylist,
  setActivePlaylist,
}
