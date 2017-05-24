import { addNotification as notify } from 'reapop'
import { checkStatus, parseJSON } from '../../utils/fetchUtils'
import fetch from 'isomorphic-fetch'
const Promise = require('bluebird')
const uuidV4 = require('uuid/v4')

const appendTracks = (ownerId, playlistId) => (dispatch, getState) => {
  const { user, tracksMetaData: meta } = getState()
  let limit = 50
  let offset = meta ? meta.offset + limit : 0

  if (!meta || meta.offset + meta.limit < meta.total) {
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

const sortCustomTracksDesc = () => (dispatch, getState) => {
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_DESC',
  })
}

const sortCustomTracksAsc = () => (dispatch, getState) => {
  dispatch({
    type: 'SORT_CUSTOM_TRACKS_ASC',
  })
}

const resetTracks = () => (dispatch, getState) => {
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

const getAudioFeaturesForTrack = trackId => (dispatch, getState) => {
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

export default {
  appendTracks,
  resetTracks,
}
