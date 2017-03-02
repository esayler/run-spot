import React from 'react'
import TracksTable from './TracksTable'

export default class Tracks extends React.Component {

  componentWillMount() {
    const ownerId = this.props.match.params.ownerId
    const playlistId = this.props.match.params.playlistId

    this.props.appendTracks(ownerId, playlistId)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    this.props.createNewPlaylist()
  }

  render() {
    const { tracks } = this.props
    if (tracks.length > 0) {
      return (
        <div>
          <button className='create-new-playlist-btn' onClick={this.handleSubmit}>Create New Playlist</button>
          <div>
            <h2>Tracks</h2>
            <TracksTable className='tracks-table' data={tracks} />
          </div>
      </div>
      )
    } else {
      return (<div>No Tracks to Display!</div>)
    }
  }
}
