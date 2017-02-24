import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import TracksTable from './TracksTable'

export default class Tracks extends React.Component {

  componentWillMount() {
    const ownerId = this.props.match.params.ownerId
    const playlistId = this.props.match.params.playlistId

    axios.get(`http://localhost:8000/api/tracks/${ownerId}/${playlistId}`)
      .then(res => {
        console.log(res.data)
        const trackList = res.data ? res.data.items.map(({ track }) => Object.assign({}, { id: track.id, album: track.album.name, artist: track.artists[0].name, name: track.name })) : []
        this.props.appendTracks(trackList)
      })
  }

  render() {
    // const renderTracks = this.state.tracks ? this.state.tracks.map(track => (<div key={track.id}> {track.name} - {track.artist} - {track.album} </div>)) : []
    return (<TracksTable className='tracks-table' data={this.props.tracks ? this.props.tracks : []} />)
  }
}
