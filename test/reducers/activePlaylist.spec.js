/* eslint-env jest */
import activePlaylist from '../../client/reducers/activePlaylist'

const initialState = {}
const mockPlaylist = {
  playlistName: 'playlistName',
  playlistId: 1,
  userId: 'testUser',
  total: 20,
}

describe('activePlaylist', () => {
  it('should return initial state by default', () => {
    expect(activePlaylist(undefined, {})).toEqual(initialState)
  })

  it('should set active playlist on SET_ACTIVE_PLAYLIST', () => {
    expect(
      activePlaylist(
        {},
        {
          type: 'SET_ACTIVE_PLAYLIST',
          ...mockPlaylist,
        }
      )
    ).toEqual(mockPlaylist)
  })
})
