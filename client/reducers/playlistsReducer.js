const playlists = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'APPEND_PLAYLISTS_PENDING':
      return state
    case 'APPEND_PLAYLISTS_FULFILLED':
      return Object.assign({}, { data: state.data.concat(action.payload.data), meta: action.payload.meta })
    case 'APPEND_PLAYLISTS_REJECTED':
      return state
    default:
      return state
  }
}

export default playlists
