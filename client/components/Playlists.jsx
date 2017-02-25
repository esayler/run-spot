import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import PlaylistsTable from './PlaylistsTable'

export default class Playlists extends React.Component {

  componentWillMount() {
    this.props.appendPlaylists()
  }

  render() {
    return (<PlaylistsTable className='playlists-table' data={this.props.userPlaylists ? this.props.userPlaylists : []} />)
  }
}
