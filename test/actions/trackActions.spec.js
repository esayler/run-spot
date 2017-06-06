/* eslint-env jest */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import fetchMock from 'fetch-mock'
import trackActions from '../../client/actions/trackActions'

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

describe('trackActions', () => {
  afterEach(() => {
    expect(fetchMock.calls().unmatched).toEqual([])
    store.clearActions()
    fetchMock.restore()
  })

  describe('appendTracks()', () => {
    it.skip('should append tracks to store on success', async () => {
      let expectedActions = [
        { type: 'APPEND_TRACKS_PENDING' },
        {
          type: 'SET_TRACKS_META_DATA',
          data: { next: null, offset: 0, limit: 50, total: 30 },
        },
        {
          type: 'APPEND_TRACKS_FULFILLED',
          payload: {
            data: [
              {
                album: 'Barcelona / Aqua Pura',
                artist: 'MISOGI',
                id: '2TpbXsC4b4EBxAvIykZmtq',
                name: 'Barcelona',
                uuid: 'a0160e6f-5593-49d8-bef0-c7a102542280',
              },
              {
                album: 'W:/2016ALBUM/',
                artist: 'deadmau5',
                id: '1N31Wy2PWz5HvCzMbff3mO',
                name: 'Snowcone',
                uuid: '6d528633-fae1-4c42-b1ec-2b6aaadf6eac',
              },
            ],
          },
        },
        { type: 'ADD_AUDIO_FEATURES_PENDING' },
        { type: 'ADD_AUDIO_FEATURES_PENDING' },
        { payload: {}, type: 'ADD_AUDIO_FEATURES_FULFILLED' },
        { payload: {}, type: 'ADD_AUDIO_FEATURES_FULFILLED' },
        { type: 'SORT_CUSTOM_TRACKS_DESC' },
      ]

      jest.mock('uuid/v4', () => {
        return jest.fn(() => 1)
      })

      const ownerId = undefined
      const playlistId = undefined
      const offset = 0
      const limit = 50

      fetchMock.get(`/api/tracks/${ownerId}/${playlistId}/${offset}/${limit}`, {
        offset: 0,
        next: null,
        limit: 50,
        previous: null,
        total: 30,
        items: [
          {
            track: {
              id: '2TpbXsC4b4EBxAvIykZmtq',
              album: {
                name: 'Barcelona / Aqua Pura',
              },
              name: 'Barcelona',
              artists: [
                {
                  name: 'MISOGI',
                },
              ],
            },
          },
          {
            track: {
              id: '1N31Wy2PWz5HvCzMbff3mO',
              album: {
                name: 'W:/2016ALBUM/',
              },
              name: 'Snowcone',
              artists: [{ name: 'deadmau5' }],
            },
          },
        ],
      })

      fetchMock.get(`begin:/api/audiofeatures/`, {})

      return await store.dispatch(trackActions.appendTracks()).then(() => {
        let actualActions = store.getActions()
        expect(actualActions.length).toEqual(8)
        expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
      })
    })
  })

  describe('sortCustomTracksDesc()', () => {
    it('should dispatch the correct action', () => {
      let expectedActions = [{ type: 'SORT_CUSTOM_TRACKS_DESC' }]

      store.dispatch(trackActions.sortCustomTracksDesc())
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(1)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })

  describe('sortCustomTracksAsc()', () => {
    it('should disptach the correct action', () => {
      let expectedActions = [{ type: 'SORT_CUSTOM_TRACKS_ASC' }]

      store.dispatch(trackActions.sortCustomTracksAsc())
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(1)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })

  describe('resetTracks()', () => {
    it('should dispatch the correct actions', () => {
      let expectedActions = [
        {
          type: 'REMOVE_TRACKS',
          data: [],
        },
        {
          type: 'REMOVE_CUSTOM_TRACKS',
        },
        {
          type: 'SET_TRACKS_META_DATA',
          data: null,
        },
      ]

      store.dispatch(trackActions.resetTracks())
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(3)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })

  describe('getAudioFeaturesForTrack()', () => {
    it('should dispatch the correct actions', async () => {
      let expectedActions = [
        {
          type: 'ADD_AUDIO_FEATURES_PENDING',
        },
        {
          type: 'ADD_AUDIO_FEATURES_FULFILLED',
          payload: {},
        },
      ]
  
      fetchMock.get(`begin:/api/audiofeatures/`, {})

      return await store.dispatch(trackActions.getAudioFeaturesForTrack(1))
      .then(() => {
        let actualActions = store.getActions()
        expect(actualActions.length).toEqual(2)
        expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
      })
    })
  })
})
