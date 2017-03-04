import { connect } from 'react-redux'
import { setActiveUser, getActiveUser, removeActiveUser } from '../actions'
import Header from '../components/header'

const mapStateToProps = (state) => {
  return { activeUser: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveUser: (data) => {
      dispatch(setActiveUser(data))
    },
    getActiveUser: () => {
      dispatch(getActiveUser())
    },
    removeActiveUser: () => {
      dispatch(removeActiveUser())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
