import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './components/app'

// reducers
import reducers from './reducers'
const store = createStore(reducers)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.querySelector('.container'))
