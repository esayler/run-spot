import { connect } from 'react-redux'
import { setActiveUser, getActiveUser } from '../actions'
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
