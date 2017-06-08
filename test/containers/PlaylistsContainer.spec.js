/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { MemoryRouter } from 'react-router'
import PlaylistsContainer from '../../client/containers/PlaylistsContainer'
import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'

const mockUser = {
  display_name: 'Eric Sayler',
  href: 'https://api.spotify.com/v1/users/easayler',
  id: 'easayler',
  type: 'user',
  uri: 'spotify:user:easayler',
}

const mockPlaylists = {
  data: [
    {
      id: '35eudeBCpWuFfyzVwN5qSD',
      name: 'New Custom Playlist',
      owner: 'easayler',
      total: 30,
    },
    {
      id: '2Ru7VhGRRqDJglibjz8gqA',
      name: 'New Custom Playlist',
      owner: 'easayler',
      total: 30,
    },
  ],
}

const mockMetaData = {
  offset: 2,
  limit: 2,
  total: 20,
  next: true,
}

const mockStore = configureMockStore([thunk, promiseMiddleware()])

const store = mockStore({
  playlists: mockPlaylists,
  user: mockUser,
  playlistsMetaData: mockMetaData,
  sematable: {
    AllPlaylists: {
      tableName: 'AllPlaylists',
      page: 0,
      pageSize: 50,
      pageSizes: [5, 10, 50, 100, -1],
      filter: [],
      filterText: null,
      direction: 'asc',
      selectAll: false,
      userSelection: [],
      configs: { defaultPageSize: 50 },
      initialData: mockPlaylists.data,
      columns: [
        {
          key: 'id',
          header: 'ID',
          sortable: false,
          searchable: false,
          primaryKey: true,
          hidden: true,
        },
        {
          header: 'Playlists',
          sortable: true,
          searchable: false,
        },
        {
          key: 'name',
          header: 'Playlist',
          searchable: true,
          hidden: true,
        },
        {
          key: 'owner',
          header: 'Owner',
          sortable: true,
          searchable: true,
        },
        {
          key: 'total',
          header: '# of Tracks',
          sortable: true,
          searchable: false,
        },
      ],
      primaryKey: 'id',
    },
  },
})

const context = {}

const setup = () => {
  let Container = mount(
    <Provider store={store}>
      <MemoryRouter location={'/'} context={context}>
        <PlaylistsContainer />
      </MemoryRouter>
    </Provider>
  )

  let Component = Container.find('Playlists')

  return {
    Container,
    Component,
  }
}

describe('PlaylistsContainer', () => {
  it('should pass `user` state down to <Playlists /> as `user`', () => {
    const { Component } = setup()
    expect(Component.props().user).toEqual(mockUser)
  })

  it('should pass `playlists` state down to <Playlists /> as `playlists`', () => {
    const { Component } = setup()
    expect(Component.props().playlists).toEqual(mockPlaylists.data)
  })

  it('should pass `playlistsMetaData` state down to <Playlists /> as `playlistsMetaData`', () => {
    const { Component } = setup()
    expect(Component.props().playlistsMetaData).toEqual(mockMetaData)
  })

  it('should pass `playlistActions` action creators to <Playlists />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'playlists',
      'user',
      'playlistsMetaData',
      'appendPlaylists',
      'createNewPlaylist',
      'setActivePlaylist'
    )
  })
})
