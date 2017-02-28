import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
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
    // console.log('Tracks props', this.props);
    const { tracks } = this.props
    if (tracks.length > 0) {
      return (
        <div>
          <button className='create-new-playlist-btn' onClick={this.handleSubmit}>Create New Playlist</button>
          <div>
            <h3>Tracks</h3>
            <TracksTable className='tracks-table' data={tracks} />
          </div>
      </div>
      )
    } else {
      return (<div>No Tracks to Display!</div>)
    }
  }
}
