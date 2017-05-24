import { addNotification as notify } from 'reapop'
import { checkStatus, parseJSON } from '../../utils/fetchUtils'
import fetch from 'isomorphic-fetch'
const Promise = require('bluebird')

const setActiveUser = data => {
  return {
    type: 'SET_ACTIVE_USER',
    data,
  }
}

const getActiveUser = () => (dispatch, getState) => {
  return dispatch({
    type: 'GET_ACTIVE_USER',
    payload: fetch('/api/me/')
      .then(checkStatus)
      .then(parseJSON)
      .then(payload => {
        return Promise.all([
          dispatch(setActiveUser(payload.body)),
          dispatch(
            notify({
              message: 'Succesfully Logged in',
              position: 'tc',
              status: 'success',
            })
          ),
        ])
      })
      .catch(err => {
        dispatch(
          notify({
            title: 'Please Login!',
            message: `${err}`,
            position: 'tc',
            status: 'warning',
          })
        )
      }),
  })
}

const removeActiveUser = () => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_ACTIVE_USER',
    data: false,
  })
}

export default {
  setActiveUser,
  getActiveUser,
  removeActiveUser,
}
