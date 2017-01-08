import React, { Component } from 'react'
import { connect } from 'react-redux'

import Banner from './banner'
import AppFooter from './footer'

class App extends Component {

  constructor(props) {
    super(props)
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
