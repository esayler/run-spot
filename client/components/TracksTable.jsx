import React, { Component, PropTypes } from 'react'
import sematable, { Table } from 'sematable'
import TracksTableActions from './PlaylistsTableActions'

const columns = [
  { key: 'id', header: 'id', sortable: false, searchable: false, primaryKey: true, hidden: true },
  { key: 'name', header: 'Track Name', sortable: true, searchable: true },
  { key: 'artist', header: 'Artist', sortable: true, searchable: true },
  { key: 'album', header: 'Album', sortable: true, searchable: true },
  { key: 'tempo', header: 'BPM', sortable: true, searchable: true, filterable: true },
]

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
}

class TracksTable extends Component {
  render() {
    // console.log('tracks props', this.props);
    // console.log('tracks table props', this.props)
    // console.log(this.props)
    return (
      <Table className='table-inverse'
        {...this.props}
        columns={columns}
      />
    )
  }
}

TracksTable.propTypes = propTypes
export default sematable('PlaylistTracks', TracksTable, columns, { defaultPageSize: 50 })
