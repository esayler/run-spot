import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import userActions from '../actions/userActions'
import Header from '../components/header'

const mapStateToProps = (state) => {
  return { activeUser: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(userActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
