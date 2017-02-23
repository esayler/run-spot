import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

export default class GetTracks extends React.Component {
  constructor() {
    super()
    this.state = {
      tracks: '',
    }
  }

  componentWillMount() {
    axios.get('http://localhost:8000/api/tracks/')
      .then(res => {
        const trackList = res.data ? res.data.items.map(({ track }) => Object.assign({}, { id: track.id, album: track.album.name, artist: track.artists[0].name, name: track.name })) : []
        this.setState({tracks: trackList})
      })
  }

  render() {
    // const renderTracks = this.state.tracks ? this.state.tracks.map(track => (<div key={track.id}> {track.name} - {track.artist} - {track.album} </div>)) : []

    return (
      <div className='content-box'>
        <div>
          <Table
            width={900}
            height={1000}
            headerHeight={20}
            rowHeight={30}
            rowCount={this.state.tracks.length}
            rowGetter={({ index }) => this.state.tracks[index]}
            >
              <Column
                label='Name'
                dataKey='name'
                width={300}
              />
              <Column
                width={300}
                label='Artist'
                dataKey='artist'
              />
              <Column
                width={300}
                label='Album'
                dataKey='album'
              />
            </Table>
        </div>
      </div>
    )
  }
}
