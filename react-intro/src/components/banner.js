import React, { Component } from 'react'
import messages from '../services/messages'

export default class Banner extends Component {
  constructor() {
    super()
    this.state = {
      message: '',
      buttonText: 'Update message'
    }
  }

  componentDidMount() {
    this.updateMessage()
  }

  updateMessage() {
    this.setState({ message: messages.get() })
  }

  render() {
    return (
      <div className='banner'>
        <h1>{this.state.message}</h1>
        <button onClick={() => this.updateMessage()}>{this.state.buttonText}</button>
        <img src={'/assets/img/react-logo.png'} style={{ maxWidth: '400px', height: 'auto', margin: '0 auto' }} />
      </div>
    )
  }
}
