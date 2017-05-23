import React from 'react'
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
      return (<h2 className='note'>Please Login with Spotify to View your Playlists</h2>)
    } else {
      return (
        <div>
          <button
            className='btn button add-playlists-btn'
            disabled={!this.props.playlistsMetaData.next}
            onClick={() => this.handleClick()}
          >
            Get More Playlists
          </button>
          <PlaylistsTable
            className='playlists-table'
            data={playlists}
          />
          <button
            className='btn button add-playlists-btn'
            disabled={!this.props.playlistsMetaData.next}
            onClick={() => this.handleClick()}
          >
            Get More Playlists
          </button>
        </div>
      )
    }
  }
}
