import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer as HotReloader } from 'react-hot-loader'
import Root from './components/Root'
import 'react-select/dist/react-select.css'

import './styles/bootstrap/scss/bootstrap.scss'
import './styles/base.scss'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <HotReloader>
    <Root />
  </HotReloader>, rootElement)

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    ReactDOM.render(
      <HotReloader>
        <Root />
      </HotReloader>, rootElement)
  })
}
