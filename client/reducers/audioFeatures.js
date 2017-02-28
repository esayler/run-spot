const audioFeatures = (state = { items: [] }, action) => {
  switch (action.type) {
    // case 'ADD_AUDIO_FEATURES_PENDING':
    //   return Object.assign({}, state, { audioFeaturesIsPending: true })
    // case 'ADD_AUDIO_FEATURES_REJECTED':
    //   return Object.assign({}, state, { audioFeaturesIsRejected: true, error: action.payload })
    // case 'ADD_AUDIO_FEATURES_FULFILLED':
    //   return {
    //     audioFeaturesIsPending: false,
    //     audioFeaturesIsRejected: false,
    //   }
    default:
      return state
  }
}

export default audioFeatures
