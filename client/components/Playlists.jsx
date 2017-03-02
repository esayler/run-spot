import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'
import PlaylistsTable from './PlaylistsTable'

export default class Playlists extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    this.props.appendPlaylists()
  }

  handleClick() {
    this.props.appendPlaylists()
  }

  render() {
    const { playlists } = this.props

    if (playlists) {
      return (
        <div>
          <button className='button' onClick={() => this.handleClick()}>Get more Playlists</button>
          <PlaylistsTable className='playlists-table' data={playlists} />
        </div>
      )
    } else {
      return (<div>No Playlists to Display!</div>)
    }
  }
}
