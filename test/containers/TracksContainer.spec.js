/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { MemoryRouter } from 'react-router'
import TracksContainer from '../../client/containers/TracksContainer'
import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'

const mockUser = {
  display_name: 'Eric Sayler',
  href: 'https://api.spotify.com/v1/users/easayler',
  id: 'easayler',
  type: 'user',
  uri: 'spotify:user:easayler',
}

const mockTracks = [
  {
    id: '25Y0hQj3J2ImLENYYMSSJm',
    uuid: '469fced8-2534-4030-a216-4888cf00f582',
  },
  {
    id: '3anyoDE1gcNsRtLmkE55bU',
    uuid: '7b125082-e5cf-4777-a4ce-505d8215ae24',
  },
  {
    id: '5XwoHJcZ8LtVV7iKq3vlI7',
    uuid: 'f051199e-35e5-4b14-ae0a-21bea7ef33e6',
  },
  {
    id: '3SE468U4Ij8Ene4y8kzKZW',
    uuid: '6f384611-f03e-47d7-8bf3-286bac7cd5f5',
  },
]

const mockPlaylistsMetaData = {
  offset: 2,
  limit: 2,
  total: 20,
  next: true,
}

const mockTracksMetaData = {
  next: null,
  offset: 0,
  limit: 50,
  total: 30,
}

const mockStore = configureMockStore([thunk, promiseMiddleware()])

const store = mockStore({
  customPlaylist: {
    tracks: mockTracks,
  },
  tracks: mockTracks,
  user: mockUser,
  playlistsMetaData: mockPlaylistsMetaData,
  tracksMetaData: mockTracksMetaData,
  activePlaylist: {},
  sematable: {
    PlaylistTracks: {
      page: 0,
      pageSize: 50,
      pageSizes: [5, 10, 50, 100, -1],
      filter: [],
      filterText: null,
      sortKey: 'tempo',
      direction: 'desc',
      selectAll: false,
      userSelection: [],
      configs: {
        defaultPageSize: 50,
        sortKey: 'tempo',
        sortDirection: 'desc',
      },
      tableName: 'PlaylistTracks',
      initialData: mockTracks,
      columns: [
        {
          key: 'uuid',
          header: 'uuid',
          sortable: false,
          searchable: false,
          filterable: false,
          primaryKey: true,
          hidden: true,
        },
        {
          key: 'name',
          header: 'Track Name',
          sortable: false,
          searchable: true,
          filterable: true,
        },
        {
          key: 'artist',
          header: 'Artist',
          sortable: false,
          searchable: true,
          filterable: true,
        },
        {
          key: 'album',
          header: 'Album',
          sortable: false,
          searchable: true,
          filterable: true,
        },
        {
          key: 'playlistName',
          header: 'Playlist',
          sortable: false,
          searchable: true,
          filterable: true,
        },
        {
          key: 'userId',
          header: 'Playlist Owner',
          sortable: false,
          searchable: true,
          filterable: true,
        },
        {
          key: 'tempo',
          header: 'BPM',
          sortable: true,
          searchable: true,
          filterable: true,
        },
      ],
      primaryKey: 'uuid',
    },
  },
})

const context = {}

const setup = () => {
  let Container = mount(
    <Provider store={store}>
      <MemoryRouter
        location={'/tracks/easayler/35eudeBCpWuFfyzVwN5qSD'}
        context={context}
      >
        <TracksContainer
          match={{
            params: {
              ownerId: 'easayler',
              playlistId: '35eudeBCpWuFfyzVwN5qSD',
            },
          }}
        />
      </MemoryRouter>
    </Provider>
  )

  let Component = Container.find('Tracks')

  return {
    Container,
    Component,
  }
}

describe('TracksContainer', () => {
  it('should pass `tracks` state down to <Tracks /> as `tracks`', () => {
    const { Component } = setup()
    expect(Component.props().tracks).toEqual(mockTracks)
  })

  it('should pass `tracksMetaData` state down to <Tracks /> as `tracksMetaData`', () => {
    const { Component } = setup()
    expect(Component.props().tracksMetaData).toEqual(mockTracksMetaData)
  })

  it('should pass `sortInfo` state down to <Tracks /> as `sortInfo`', () => {
    const { Component } = setup()
    expect(Component.props().sortInfo).toEqual({
      direction: 'desc',
      sortKey: 'tempo',
    })
  })

  it('should pass `tracksActions` action creators to <Tracks />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'tracks',
      'tracksMetaData',
      'sortInfo',
      'appendTracks',
      'resetTracks',
      'sortCustomTracksDesc',
      'sortCustomTracksAsc',
      'getAudioFeaturesForTrack',
      'createNewPlaylist',
      'setActivePlaylist'
    )
  })

  it('should pass `createNewPlaylist` action creator to <Tracks />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'createNewPlaylist',
      'setActivePlaylist'
    )
  })

  it('should pass `setActivePlaylist` action creator to <Tracks />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'setActivePlaylist'
    )
  })

  it('should pass `match` action creator to <Tracks />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'match'
    )
  })
})
