import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import PlaylistsTable from './PlaylistsTable'

export default class Playlists extends React.Component {

  componentWillMount() {
    this.props.appendPlaylists()
  }

  render() {
    const { playlists } = this.props

    if (playlists) {
      return (
        <div>
          <PlaylistsTable className='playlists-table' data={playlists} />
        </div>
      )
    } else {
      return (<div>No Playlists to Display!</div>)
    }
  }
}
