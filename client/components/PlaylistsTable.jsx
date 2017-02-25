import React, { Component, PropTypes } from 'react'
import sematable, { Table } from 'sematable'
import PlayListsTableActions from './PlaylistsTableActions'

const columns = [
  { key: 'id', header: 'ID', sortable: false, searchable: false, primaryKey: true, hidden: true },
  { header: 'Tracks', sortable: false, searchable: false, Component: PlayListsTableActions },
  { key: 'name', header: 'Playlist', sortable: true, searchable: true, hidden: true },
  { key: 'owner', header: 'Owner', sortable: true, searchable: true },
  { key: 'total', header: 'Total', sortable: true, searchable: false },
]

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
}

class PlaylistsTable extends Component {
  render() {
    return (
      <Table key='1' className='table-inverse'
        {...this.props}
        columns={columns}
      />
    )
  }
}

PlaylistsTable.propTypes = propTypes
export default sematable('AllPlaylists', PlaylistsTable, columns, {defaultPageSize: 20})
