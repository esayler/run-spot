const tracksMetaData = (state = null, action) => {
  switch (action.type) {
    case 'SET_TRACKS_META_DATA':
      return action.data
    default:
      return state
  }
}

export default tracksMetaData
