/* eslint-env jest */
import tracks from '../../client/reducers/tracksReducer'

const initialState = [{ id: 1 }, { id: 2 }]
const mockTracks = [{ id: 3 }, { id: 4 }]

describe('tracks', () => {
  it('should return initial state by default', () => {
    expect(tracks(undefined, {})).toEqual([])
  })

  it('should append tracks on APPEND_TRACKS_FULFILLED', () => {
    expect(
      tracks(initialState, {
        type: 'APPEND_TRACKS_FULFILLED',
        payload: {
          data: mockTracks,
        },
      })
    ).toEqual(initialState.concat(mockTracks))
  })

  it('should append playlists on ADD_AUDIO_FEATURES_FULFILLED', () => {
    expect(
      tracks(initialState, {
        type: 'ADD_AUDIO_FEATURES_FULFILLED',
        payload: {
          id: 1,
          tempo: 180,
        },
      })
    ).toEqual([{ id: 1, tempo: 180 }, { id: 2 }])
  })

  it('should return state if on ADD_AUDIO_FEATURES_REJECTED', () => {
    expect(
      tracks(initialState, {
        type: 'APPEND_PLAYLISTS_REJECTED',
      })
    ).toEqual(initialState)
  })

  it('should return state if on APPEND_TRACKS_PENDING', () => {
    expect(
      tracks(initialState, {
        type: 'APPEND_PLAYLISTS_PENDING',
      })
    ).toEqual(initialState)
  })

  it('should return state if on APPEND_TRACKS_REJECTED', () => {
    expect(
      tracks(initialState, {
        type: 'APPEND_PLAYLISTS_REJECTED',
      })
    ).toEqual(initialState)
  })
})
