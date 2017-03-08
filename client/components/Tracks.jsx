import React from 'react'
import TracksTable from './TracksTable'

export default class Tracks extends React.Component {

  componentWillMount() {
    const ownerId = this.props.match.params.ownerId
    const playlistId = this.props.match.params.playlistId

    this.props.appendTracks(ownerId, playlistId)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGetTracks = this.handleGetTracks.bind(this)
    this.handleClearTracks = this.handleClearTracks.bind(this)
  }

  handleSubmit() {
    this.props.createNewPlaylist()
  }

  handleGetTracks() {
    this.props.appendTracks(this.props.match.params.ownerId, this.props.match.params.playlistId)
  }

  handleClearTracks() {
    this.props.resetTracks()
  }

  render() {
    let { tracks } = this.props

    if (tracks.length > 0) {
      return (
        <div>
          <div className='button-group'>
            <button className='btn button create-new-playlist-button' onClick={this.handleSubmit}>Create New Playlist</button>
            <button className='btn button get-more-tracks-button' onClick={this.handleGetTracks}>Get More Tracks</button>
            <button className='btn button clear-tracks-button' onClick={this.handleClearTracks}>Clear All Tracks</button>
          </div>
          <div>
            <p>Click 'Get More Tracks' to add the next 50 tracks to the tracklist</p>
          </div>
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
