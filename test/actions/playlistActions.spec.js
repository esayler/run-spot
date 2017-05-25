/* eslint-env jest */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import fetchMock from 'fetch-mock'
import playlistActions from '../../client/actions/playlistActions'

const mockStore = configureMockStore([thunk, promiseMiddleware()])

const store = mockStore({
  playlistsMetaData: {
    next: 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
    offset: 0,
    limit: 50,
    total: 273,
  },
  customPlaylist: [],
})

const offset = 50
const limit = 50
const url = `/api/get_playlists?offset=${offset}&limit=${limit}`

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
        { type: 'SET_PLAYLISTS_META_DATA',
          data: {
            limit: 50,
            next: 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
            offset: 0,
            total: 273,
          } },
        { type: 'APPEND_PLAYLISTS_FULFILLED',
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
              next: 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
              offset: 0,
              total: 273,
            },
          },
        },
      ]

      fetchMock.get(url, {
        offset: 0,
        next: 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
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

      return await store.dispatch(playlistActions.appendPlaylists())
        .then(() => {
          let actualActions = store.getActions()
          expect(actualActions.length).toEqual(3)
          expect(actualActions).toEqual(expectedActions)
          let state = store.getState()
          expect(state).toEqual({
            'customPlaylist': [],
            'playlistsMetaData': {
              'limit': 50,
              'next': 'https://api.spotify.com/v1/users/easayler/playlists?offset=50&limit=50',
              'offset': 0,
              'total': 273,
            },
          })
        })
    })
  })
})
