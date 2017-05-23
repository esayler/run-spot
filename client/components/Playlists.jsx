import React from 'react'
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

    if (!this.props.user) {
      return (<h4>Please Login with Spotify to View your Playlists</h4>)
    } else {
      return (
        <div>
          <p>Click on a playlist name to add it's first 50 tracks to the tracklist</p>
          <p>Click 'Get More Playlists' to add retrieve 50 more personal playlists</p>
          <button className='button' onClick={() => this.handleClick()}>Get More Playlists</button>
          <PlaylistsTable className='playlists-table' data={playlists} />
        </div>
      )
    }
  }
}
