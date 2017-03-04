const user = (state = false, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_USER':
      return action.data
    case 'REMOVE_ACTIVE_USER':
      return false
    default:
      return state
  }
}

export default user
