import React, {Component} from 'react'
import NotificationsSystem from 'reapop'
import myTheme from './theme'

export default class MyNotificationsSystem extends Component {
  render() {
    return (
      <NotificationsSystem theme={myTheme} />
    )
  }
}
