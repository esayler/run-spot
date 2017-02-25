import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import TracksTable from './TracksTable'

export default class Tracks extends React.Component {

  componentWillMount() {
    const ownerId = this.props.match.params.ownerId
    const playlistId = this.props.match.params.playlistId

    this.props.appendTracks(ownerId, playlistId)
  }

  render() {
    // return null
    // const renderTracks = this.state.tracks ? this.state.tracks.map(track => (<div key={track.id}> {track.name} - {track.artist} - {track.album} </div>)) : []
    return (<TracksTable className='tracks-table' data={this.props.tracks ? this.props.tracks : []} />)
  }
}
