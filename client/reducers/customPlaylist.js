import _ from 'lodash'

const customPlaylist = (state = { tracks: [] }, action) => {
  switch (action.type) {
    case 'sematable/TABLE_INITIALIZE':
      if (action.payload.tableName === 'PlaylistTracks') {
        return Object.assign(state, {
          sortKey: action.payload.configs.sortKey,
          sortDirection: action.payload.configs.sortDirection,
        })
      } else {
        return state
      }
    case 'APPEND_TRACKS_FULFILLED':
      return Object.assign(state, { tracks: state.tracks.concat(action.payload.data) })
    case 'ADD_AUDIO_FEATURES_FULFILLED':
      const newState = state.tracks.map(track => {
        if (track.id === action.payload.id) {
          return {
            ...track,
            ...action.payload,
          }
        } else {
          return track
        }
      })
      return Object.assign(state, { tracks: newState })
    case 'sematable/TABLE_SORT_CHANGED':
      if (action.payload.tableName !== 'PlaylistTracks') {
        return state
      }
      if (state.sortDirection === 'asc') {
        const newTrackOrder = _.reverse(_.sortBy(state.tracks, [track => track.tempo]))
        return Object.assign(state, { tracks: newTrackOrder, sortDirection: 'desc' })
      } else {
        const newTrackOrder = _.sortBy(state.tracks, [track => track.tempo])
        return Object.assign(state, { tracks: newTrackOrder, sortDirection: 'asc' })
      }
    case 'SORT_CUSTOM_TRACKS_DESC':
      const newDescTrackOrder = _.reverse(_.sortBy(state.tracks, [track => track.tempo]))
      return Object.assign({}, state, { tracks: newDescTrackOrder, sortDirection: 'desc' })
    case 'SORT_CUSTOM_TRACKS_ASC':
      const newAscTrackOrder = _.sortBy(state.tracks, [track => track.tempo])
      return Object.assign({}, state, { tracks: newAscTrackOrder, sortDirection: 'asc' })
    case 'REMOVE_CUSTOM_TRACKS':
      return {
        tracks: [],
      }
    default:
      return state
  }
}

export default customPlaylist
