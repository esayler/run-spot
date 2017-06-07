/* eslint-env jest */
import customPlaylist from '../../client/reducers/customPlaylist'

describe('activePlaylist', () => {
  it('should return initial state by default', () => {
    expect(customPlaylist(undefined, {})).toEqual({ tracks: [] })
  })


  it('should set the sortKey and sortDirection when table name is PlaylistTracks on sematable/TABLE_INITIALIZE', () => {
    expect(
      customPlaylist({ tracks: [] }, {
        type: 'sematable/TABLE_INITIALIZE',
        payload: {
          tableName: 'PlaylistTracks',
          configs: {
            sortKey: 'tempo',
            sortDirection: 'desc',
          },
        },
      })
    ).toEqual({ tracks: [], sortKey: 'tempo', sortDirection: 'desc' })
  })

  it('should set playlist on ADD_AUDIO_FEATURES_FULFILLED', () => {
    expect(
      customPlaylist({ tracks: [ { id: 1 }, { id: 2 } ] }, {
        type: 'ADD_AUDIO_FEATURES_FULFILLED',
        payload: {
          id: 1,
          tempo: 180,
        },
      })
    ).toEqual({ tracks: [ { id: 1, tempo: 180 }, { id: 2 } ] })
  })

  it('should sort tracks by tempo descending on SORT_CUSTOM_TRACKS_DESC', () => {
    expect(
      customPlaylist({ tracks: [{ id: 1, tempo: 180 }, { id: 2, tempo: 165 }] }, {
        type: 'SORT_CUSTOM_TRACKS_DESC',
      })
    ).toEqual({ tracks: [ { id: 1, tempo: 180 }, { id: 2, tempo: 165 } ], sortDirection: 'desc' })
  })

  it('should sort tracks by tempo ascending on SORT_CUSTOM_TRACKS_ASC', () => {
    expect(
      customPlaylist({ tracks: [{ id: 1, tempo: 180 }, { id: 2, tempo: 165 }] }, {
        type: 'SORT_CUSTOM_TRACKS_ASC',
      })
    ).toEqual({ tracks: [ { id: 2, tempo: 165 }, { id: 1, tempo: 180 } ], sortDirection: 'asc' })
  })

  it('should sort tracks ascending on sematable/TABLE_SORT_CHANGED', () => {
    expect(
      customPlaylist({ tracks: [{ id: 1, tempo: 180 }, { id: 2, tempo: 165 }] }, {
        type: 'sematable/TABLE_SORT_CHANGED',
        payload: {
          tableName: 'PlaylistTracks',
          configs: {
            sortKey: 'tempo',
            sortDirection: 'desc',
          },
        },
      })
    ).toEqual({ tracks: [ { id: 2, tempo: 165 }, { id: 1, tempo: 180 } ], sortDirection: 'asc' })
  })

  it('should sort tracks ascending on sematable/TABLE_SORT_CHANGED', () => {
    expect(
      customPlaylist({ tracks: [{ id: 1, tempo: 180 }, { id: 2, tempo: 165 }] }, {
        type: 'sematable/TABLE_SORT_CHANGED',
        payload: {
          tableName: 'PlaylistTracks',
          configs: {
            sortKey: 'tempo',
            sortDirection: 'desc',
          },
        },
      })
    ).toEqual({ tracks: [ { id: 2, tempo: 165 }, { id: 1, tempo: 180 } ], sortDirection: 'asc' })
  })

  it('should sort tracks ascending on REMOVE_CUSTOM_TRACKS', () => {
    expect(
      customPlaylist({ tracks: [{ id: 1, tempo: 180 }, { id: 2, tempo: 165 }] }, {
        type: 'REMOVE_CUSTOM_TRACKS',
      })
    ).toEqual({ tracks: [] })
  })
})
