/* eslint-env jest */
import user from '../../client/reducers/userReducer'

const initialState = false

const mockUser = {
  display_name: 'Eric Sayler',
  href: 'https://api.spotify.com/v1/users/easayler',
  id: 'easayler',
  type: 'user',
  uri: 'spotify:user:easayler',
}

describe('user', () => {
  it('should return initial state by default', () => {
    expect(user(undefined, {})).toEqual(initialState)
  })

  it('should set active user on SET_ACTIVE_PLAYLIST', () => {
    expect(
      user(
        {},
        {
          type: 'SET_ACTIVE_USER',
          data: { ...mockUser },
        },
      )
    ).toEqual(mockUser)
  })

  it('should remove active user on REMOVE_ACTIVE_USER', () => {
    expect(
      user(
        {},
        {
          type: 'REMOVE_ACTIVE_USER',
        }
      )
    ).toEqual(initialState)
  })
})

