### How React is kind of like Angular (\*ducks\*)

A React app also starts with a component. Like Angular, it's basically a "template" and a "controller", but it's all contained in one class. The "template" part is represented here by the JSX returned in the class's `render` method (👋 Backbone), while the "controller" is basically the rest of the class.

If JSX freaks you out, read [Facebook's explanation](https://facebook.github.io/react/docs/jsx-in-depth.html).

Here's the example banner component from before, as a React class component:
```javascript
import React, { Component } from 'react'

export default class Banner extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: 'Default message'
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <button>Update message</button>
      </div>
    )
  }

}
```

This component reads from `this.state.message` and makes changes to that message using `this.setState({ message: 'new message' })`. Whenever the state is updated, the render method is called to re-render the "view". To complete the example from before, we can add an updateMessage method and move the message handling out to some service.

The service might look like this:
```js
const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default {
  get() {
    const message = messages.shift()
    messages.push(message)
    return message
  }
}
```
_\*fwiw React doesn't have any "official" services like Angular, but encapsulating this kind of thing would still be a good idea, whatever you called it._

And the refactored component:
```javascript
import React, { Component } from 'react'
import messages from '../services/messages'

export default class Banner extends Component {
  constructor() {
    super()
    this.state = {
      message: 'The original message',
      buttonText: 'Update message'
    }
  }

  updateMessage() {
    this.setState({ message: messages.get() })
  }

  render() {
    return (
      <div className='banner'>
        <h1>{this.state.message}</h1>
        <button onClick={() => this.updateMessage()}>{this.state.buttonText}</button>
      </div>
    )
  }
}
```

And that's the banner example implemented in React. Take a look at [the complete React example](../react) to see more.

Next: [Why Flux and Redux?](redux.md)
