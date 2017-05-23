import React from 'react'
import TracksTable from './TracksTable'

export default class Tracks extends React.Component {
  componentWillMount() {
    const ownerId = this.props.match.params.ownerId
    const playlistId = this.props.match.params.playlistId
    if (ownerId && playlistId) {
      this.props.appendTracks(ownerId, playlistId)
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGetTracks = this.handleGetTracks.bind(this)
    this.handleClearTracks = this.handleClearTracks.bind(this)
    this.addTracksIsDisabled = this.addTracksIsDisabled.bind(this)
  }

  handleSubmit() {
    this.props.createNewPlaylist()
  }

  handleGetTracks() {
    this.props.appendTracks(
      this.props.match.params.ownerId,
      this.props.match.params.playlistId
    )
  }

  handleClearTracks() {
    this.props.resetTracks()
  }

  addTracksIsDisabled() {
    return false
  }

  render() {
    let { tracks } = this.props

    if (tracks.length > 0) {
      return (
        <div>
          <div className='button-group'>
            <button
              className='btn button clear-tracks-btn'
              onClick={this.handleClearTracks}
            >
              Clear All Tracks
            </button>
            <button
              className='btn button add-tracks-btn'
              disabled={
                this.props.tracksMetaData && !this.props.tracksMetaData.next
              }
              onClick={this.handleGetTracks}
            >
              Add More Tracks
            </button>
            <button
              className='btn button create-new-playlist-btn'
              onClick={this.handleSubmit}
            >
              Create New Playlist
            </button>
          </div>
          <div>
            <TracksTable className='tracks-table' data={tracks} />
          </div>
          <div className='button-group'>
            <button
              className='btn button clear-tracks-btn'
              onClick={this.handleClearTracks}
            >
              Clear All Tracks
            </button>
            <button
              className='btn button add-tracks-btn'
              disabled={
                this.props.tracksMetaData && !this.props.tracksMetaData.next
              }
              onClick={this.handleGetTracks}
            >
              Add More Tracks
            </button>
            <button
              className='btn button create-new-playlist-btn'
              onClick={this.handleSubmit}
            >
              Create New Playlist
            </button>
          </div>
        </div>
      )
    } else {
      return <h2 className='note'>No Tracks to Display!</h2>
    }
  }
}
