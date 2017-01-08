import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateMessage } from '../actions'

class Banner extends Component {
  render() {
    return (
      <div className='banner'>
        <h1>{this.props.message}</h1>
        <button onClick={this.props.updateMessage}>Update message</button>
        <img src={'/assets/img/react-logo.png'} style={{ maxWidth: '400px', height: 'auto', margin: '0 auto' }} />
      </div>
    )
  }
}

const mapStateToProps = ({ banner }) => banner

export default connect(mapStateToProps, { updateMessage })(Banner)
