import _ from 'lodash'

const tracks = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_TRACKS_PENDING':
      return state
    case 'APPEND_TRACKS_FULFILLED':
      return action.payload.data
    case 'APPEND_TRACKS_REJECTED':
      return state
    case 'ADD_AUDIO_FEATURES_PENDING':
      return state
    case 'ADD_AUDIO_FEATURES_REJECTED':
      return state
    case 'ADD_AUDIO_FEATURES_FULFILLED':
      const newState = state.map(track => {
        if (track.id === action.payload.id) {
          return {
            ...track,
            ...action.payload,
          }
        } else {
          return track
        }
      })
      return newState
    default:
      return state
  }
}

export default tracks
