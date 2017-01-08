import React, { Component } from 'react'

import Banner from './banner'
import AppFooter from './footer'

class App extends Component {

  constructor() {
    super()
    this.state = {
      url: 'https://facebook.github.io/react/'
    }
  }

  render() {
    return (
      <div className="app-container">
        <Banner />
        <AppFooter url={this.state.url} />
      </div>
    )
  }

}

export default App
