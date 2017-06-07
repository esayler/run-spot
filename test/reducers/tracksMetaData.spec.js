/* eslint-env jest */
import tracksMetaData from '../../client/reducers/tracksMetaData'

const initialState = null 

const mockMetaData = {
  next: null,
  offset: 0,
  limit: 50,
  total: 30,
}

describe('tracksMetaData', () => {
  it('should return initial state by default', () => {
    expect(tracksMetaData(undefined, {})).toEqual(initialState)
  })

  it('should set playlist meta data on SET_TRACKS_META_DATA', () => {
    expect(
      tracksMetaData(
        {},
        {
          type: 'SET_TRACKS_META_DATA',
          data: mockMetaData,
        }
      )
    ).toEqual(mockMetaData)
  })
})
