/* eslint-env jest */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import fetchMock from 'fetch-mock'
import playlistActions from '../../client/actions/playlistActions'

const mockStore = configureMockStore([thunk, promiseMiddleware()])

const store = mockStore({
  playlistsMetaData: {
    next:
      'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
    offset: 0,
    limit: 50,
    total: 273,
  },
  customPlaylist: {
    tracks: [
      {
        id: '2nKelNHX9SvNhjKB7TptJ2',
        uuid: '81e6b7ee-9b43-441a-b539-ba63827c2e08',
        album: 'Moving Lights',
        artist: 'Ten Sleep',
        name: 'Moving Lights',
        tempo: 183.813,
      },
      {
        id: '2LXS8euehEBYneMrNP1ZWr',
        uuid: 'c48fd374-fc25-4f7f-ae3d-b6c07dc78fc7',
        album: 'Ab Na Jagao',
        artist: 'Bandish Projekt',
        name: 'Ab Na Jagao',
        tempo: 172.02,
      },
      {
        id: '1Eck97uRMlprKOOJN9oO1E',
        uuid: '7a760196-6c59-47cd-88ab-75d1ebc5b0a6',
        album: 'Good Life (with G-Eazy & Kehlani)',
        artist: 'G-Eazy',
        name: 'Good Life (with G-Eazy & Kehlani)',
        tempo: 168.385,
      },
      {
        id: '0oP9pK1D1lNF3Lb7jkl6Xx',
        uuid: 'e554f657-ddbf-42f5-8a3f-12395c2be117',
        album: 'Thunder',
        artist: 'Imagine Dragons',
        name: 'Thunder',
        tempo: 167.969,
      },
    ],
  },
})

const offset = 50
const limit = 50

describe('playlistActions', () => {
  afterEach(() => {
    expect(fetchMock.calls().unmatched).toEqual([])
    store.clearActions()
    fetchMock.restore()
  })

  describe('appendPlaylists()', () => {
    it('appends Playlists to store on success', async () => {
      let expectedActions = [
        { type: 'APPEND_PLAYLISTS_PENDING' },
        {
          type: 'SET_PLAYLISTS_META_DATA',
          data: {
            limit: 50,
            next:
              'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
            offset: 0,
            total: 273,
          },
        },
        {
          type: 'APPEND_PLAYLISTS_FULFILLED',
          payload: {
            data: [
              {
                id: '1Lf1qF2qOgx8WKtYB6hIR7',
                name: 'New Custom Playlist',
                owner: 'easayler',
                total: 54,
              },
            ],
            meta: {
              limit: 50,
              next:
                'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
              offset: 0,
              total: 273,
            },
          },
        },
      ]

      fetchMock.get(`/api/get_playlists?offset=${offset}&limit=${limit}`, {
        offset: 0,
        next:
          'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
        limit: 50,
        previous: null,
        total: 273,
        items: [
          {
            id: '1Lf1qF2qOgx8WKtYB6hIR7',
            name: 'New Custom Playlist',
            owner: {
              id: 'easayler',
            },
            tracks: {
              total: 54,
            },
          },
        ],
      })

      return await store
        .dispatch(playlistActions.appendPlaylists())
        .then(() => {
          let actualActions = store.getActions()
          expect(actualActions.length).toEqual(3)
          expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
          // let state = store.getState()
          // expect(state).toEqual({
          //   'customPlaylist': [],
          //   'playlistsMetaData': {
          //     'limit': 50,
          //     'next': 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
          //     'offset': 0,
          //     'total': 273,
          //   },
          // })
        })
    })
  })

  describe('createNewPlaylist()', () => {
    it('creates new playlists on success', async () => {
      let expectedActions = [
        { type: 'CREATE_NEW_PLAYLIST_PENDING' },
        { type: 'CREATE_NEW_PLAYLIST_FULFILLED' },
      ]

      fetchMock.post('/api/playlists', {
        href:
          'https://api.spotify.com/v1/users/easayler/playlists/6Ctraunm46OdZhN39oRmLT',
        external_urls: {
          spotify:
            'http://open.spotify.com/user/easayler/playlist/6Ctraunm46OdZhN39oRmLT',
        },
        name: 'New Custom Playlist',
      })

      fetchMock.post('/api/add', {
        snapshot_id:
          'lUO7NQZDLJnsixqIXiCRAweOT+bLc2aDpxKhNx8kgLvB20iI60maOHZVNS9usXjW',
      })

      return await store
        .dispatch(playlistActions.createNewPlaylist())
        .then(() => {
          let actualActions = store.getActions()
          expect(actualActions.length).toEqual(3)
          expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
          // let state = store.getState()
          // expect(state).toEqual({
          //   'customPlaylist': [],
          //   'playlistsMetaData': {
          //     'limit': 50,
          //     'next': 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
          //     'offset': 0,
          //     'total': 273,
          //   },
          // })
        })
    })
  })

  describe('setActivePlaylist()', () => {
    it('should set ActivePlaylist and clear tracks meta data', () => {
      let expectedActions = [
        {
          type: 'SET_TRACKS_META_DATA',
          data: null,
        },
        {
          type: 'SET_ACTIVE_PLAYLIST',
          playlistId: 'playlistId',
          playlistName: 'playlistName',
          total: 20,
          userId: 'userId',
        },
      ]

      store.dispatch(
        playlistActions.setActivePlaylist(
          'playlistName',
          'playlistId',
          'userId',
          20
        )
      )
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(2)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })
})
