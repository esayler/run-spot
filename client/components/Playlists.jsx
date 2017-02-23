import React from 'react'
import axios from 'axios'
import { Column, Table } from 'react-virtualized'

export default class Playlists extends React.Component {

  componentWillMount() {
    axios.get('http://localhost:8000/api/playlists/')
      .then(res => {
        const list = res.data.items ? res.data.items.map((playlist) => Object.assign({}, { id: playlist.id, name: playlist.name })) : []
        this.props.appendPlaylists(list)
      })
  }

  render() {
    return (
      <div className='content-box'>
        <div>
          <Table
            width={900}
            height={800}
            headerHeight={20}
            rowHeight={30}
            rowCount={this.props.userPlaylists ? this.props.userPlaylists.length : 0}
            rowGetter={({ index }) => this.props.userPlaylists[index]}
            >
              <Column
                label='Name'
                dataKey='name'
                width={500}
              />
            </Table>
        </div>
      </div>
    )
  }
}
