import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import PlaylistsTable from './PlaylistsTable'

export default class Playlists extends React.Component {

  componentWillMount() {
    axios.get('http://localhost:8000/api/playlists/')
      .then(res => {
        console.log('res', res);
        const list = res.data.items ? res.data.items.map((playlist) => Object.assign({}, { id: playlist.id, name: playlist.name, owner: playlist.owner.id, total: playlist.tracks.total })) : []
        this.props.appendPlaylists(list)
      })
  }

  render() {
    return (<PlaylistsTable className='playlists-table' data={this.props.userPlaylists ? this.props.userPlaylists : []} />)
  }
}
