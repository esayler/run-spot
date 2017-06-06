/* eslint-env jest */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import fetchMock from 'fetch-mock'
import userActions from '../../client/actions/userActions'

const mockStore = configureMockStore([thunk, promiseMiddleware()])

const store = mockStore({})

describe('userActions', () => {
  afterEach(() => {
    expect(fetchMock.calls().unmatched).toEqual([])
    store.clearActions()
    fetchMock.restore()
  })

  describe('getActiveUser()', () => {
    it('should set active user', async () => {
      let expectedActions = [
        { type: 'GET_ACTIVE_USER_PENDING' },
        { type: 'SET_ACTIVE_USER', data: undefined },
      ]

      fetchMock.get(`/api/me/`, {})

      return await store.dispatch(userActions.getActiveUser()).then(() => {
        let actualActions = store.getActions()
        expect(actualActions.length).toEqual(4)
        expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
      })
    })
  })

  describe('setActiveUser()', () => {
    it('should dispatch the correct action', () => {
      let expectedActions = [{ type: 'SET_ACTIVE_USER', data: {} }]

      store.dispatch(userActions.setActiveUser({}))
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(1)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })

  describe('removeActiveUser()', () => {
    it('should dispatch the correct action', () => {
      let expectedActions = [
        { 
          type: 'REMOVE_ACTIVE_USER',
          data: false,
        }
      ]

      store.dispatch(userActions.removeActiveUser())
      let actualActions = store.getActions()
      expect(actualActions.length).toEqual(1)
      expect(actualActions).toEqual(expect.arrayContaining(expectedActions))
    })
  })
})
