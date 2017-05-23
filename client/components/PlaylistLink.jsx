import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { setActivePlaylist } from '../actions'

class PlaylistLink extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(playlistName, playlistId, userId, total) {
    this.props.setActivePlaylist(playlistName, playlistId, userId, total)
  }

  render() {
    const { row } = this.props
    return (
      <Link
        onClick={() => this.handleClick(row.name, row.id, row.owner, row.total)}
        className='playlist-link'
        to={`/tracks/${row.owner}/${row.id}`}
      >
        {this.props.row.name}
      </Link>
    )
  }
}

const mapStateToProps = state => {
  return {
    sematable: state.sematable,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActivePlaylist: (playlistName, playlistId, userId) => {
      dispatch(setActivePlaylist(playlistName, playlistId, userId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistLink)
