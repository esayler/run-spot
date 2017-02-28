import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'

const propTypes = {
  row: PropTypes.object.isRequired,
}

class PlaylistsTableActions extends Component {
  render() {
    // console.log('PlaylistTableActions Props ', this.props)
    const row = this.props.row
    return (
      <Link to={`/tracks/${row.owner}/${row.id}`}>
        {this.props.row.name}
      </Link>
    )
  }
}

PlaylistsTableActions.propTypes = propTypes
export default PlaylistsTableActions
