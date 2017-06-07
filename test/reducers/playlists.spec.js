/* eslint-env jest */
import playlists from '../../client/reducers/playlistsReducer'

const initialState = { data: [] }

const mockData = [
  {
    id: '0nZHHWiCEA29TtwxL5xcvx',
    name: 'New Custom Playlist',
    owner: 'easayler',
    total: 30,
  },
]

const mockMeta = {
  next: 'next',
  offset: 0,
  limit: 50,
  total: 100,
}

describe('playlists', () => {
  it('should return initial state by default', () => {
    expect(playlists(undefined, {})).toEqual(initialState)
  })

  it('should append playlists SET_ACTIVE_PLAYLIST_PENDING', () => {
    expect(
      playlists(
        initialState,
        {
          type: 'SET_ACTIVE_PLAYLIST_PENDING',
        }
      )
    ).toEqual(initialState)
  })

  it('should append playlists on APPEND_PLAYLISTS_FULFILLED', () => {
    expect(
      playlists(
        initialState,
        {
          type: 'APPEND_PLAYLISTS_FULFILLED',
          payload: {
            data: mockData,
            meta: mockMeta,
          },
        }
      )
    ).toEqual({ data: [...mockData], meta: mockMeta })
  })

  it('should return state if on APPEND_PLAYLISTS_REJECTED', () => {
    expect(
      playlists(
        initialState,
        {
          type: 'APPEND_PLAYLISTS_REJECTED',
        }
      )
    ).toEqual(initialState)
  })
})
