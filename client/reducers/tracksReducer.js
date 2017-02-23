const tracks = (state = [], action) => {
  switch (action.type) {
    case 'APPEND_TRACKS':
      return [action.data, ...state]
    default:
      return state
  }
}

export default tracks
