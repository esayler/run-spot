import React, { Component, PropTypes } from 'react'
import PlaylistLink from './PlaylistLink'

const propTypes = {
  row: PropTypes.object.isRequired,
}

class PlaylistsTableActions extends Component {
  render() {
    return (<PlaylistLink {...this.props} />)
  }
}

PlaylistsTableActions.propTypes = propTypes
export default PlaylistsTableActions
