/* eslint-env jest */
import playlistsMetaData from '../../client/reducers/playlistsMetaData'

const initialState = { offset: -50, limit: 50, total: 999, next: true }

const mockMetaData = {
  offset: -50,
  limit: 50,
  total: 999,
  next: true,
}

describe('activePlaylist', () => {
  it('should return initial state by default', () => {
    expect(playlistsMetaData(undefined, {})).toEqual(initialState)
  })

  it('should set playlist meta data on SET_PLAYLISTS_META_DATA', () => {
    expect(
      playlistsMetaData(
        {},
        {
          type: 'SET_PLAYLISTS_META_DATA',
          data: mockMetaData,
        }
      )
    ).toEqual(mockMetaData)
  })
})
