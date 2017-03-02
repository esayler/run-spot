import React, { Component, PropTypes } from 'react'
import sematable, { Table } from 'sematable'
import TracksTableActions from './PlaylistsTableActions'

const columns = [
  { key: 'id', header: 'id', sortable: false, searchable: false, filterable: false, primaryKey: true, hidden: true },
  { key: 'name', header: 'Track Name', sortable: true, searchable: true, filterable: true },
  { key: 'artist', header: 'Artist', sortable: true, searchable: true, filterable: true },
  { key: 'album', header: 'Album', sortable: true, searchable: true, filterable: true },
  { key: 'tempo', header: 'BPM', sortable: true, searchable: true, filterable: true },
]

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
}

class TracksTable extends Component {
  render() {
    return (
      <Table
        {...this.props}
        selectable
        className='table-inverse table-hover table-sm'
        columns={columns}
      />
    )
  }
}

TracksTable.propTypes = propTypes
export default sematable('PlaylistTracks', TracksTable, columns, { defaultPageSize: 50 })
