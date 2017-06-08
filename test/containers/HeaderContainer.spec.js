/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { MemoryRouter } from 'react-router'
import HeaderContainer from '../../client/containers/HeaderContainer'
import thunk from 'redux-thunk'

const mockUser = {
  display_name: 'Eric Sayler',
  href: 'https://api.spotify.com/v1/users/easayler',
  id: 'easayler',
  type: 'user',
  uri: 'spotify:user:easayler',
}

const mockStore = configureMockStore([thunk])
const store = mockStore({
  user: mockUser,
})

const context = {}

const setup = () => {
  let Container = mount(
    <Provider store={store}>
      <MemoryRouter location={'/'} context={context}>
        <HeaderContainer />
      </MemoryRouter>
    </Provider>
  )

  let Component = Container.find('Header')

  return {
    Container,
    Component,
  }
}

describe('HeaderContainer', () => {
  it('should pass `user` state down to <Header /> as `activeUser`', () => {
    const { Component } = setup()
    expect(Component.props().activeUser).toEqual(mockUser)
  })

  it('should pass `userActions` action creators to <Header />', () => {
    const { Component } = setup()
    expect(Object.keys(Component.props())).toContain(
      'setActiveUser',
      'getActiveUser',
      'removeActiveUser'
    )
  })
})
