# how-to-react
Remembering how I finally made sense of react

It took me a long time to even start to grasp what react is and how it would really work for a serious application. I've just started to get my head around the edges of an app that pulls together React, Redux, redux-thunk, react-router, and some other things so I want to get those notes together in a mini-guide, if for no other reason than to walk myself through it all again when I'm confused in 6 weeks.

![Demo example gif](images/how-to-react-demos.gif)

### How a JavaScript app works

Note: If you already understand Angular to some degree, you might prefer to skip to that section.

HTML works for a lot of things on the web, and if you're okay with making new requests to a server for any change, it'll do most anything. Say you have a totally useless page with a dumb banner on it.

```html
<body>
  <section>
    <h1>Default message for this banner</h1>
  </section>
  <footer>
    Brought to you by html
  </footer>
</body>
```

What HTML isn't so good at is changing things. If (for some reason) you wanted to let a user change the banner message here with just HTML, you'd probably create a new HTML page for each different banner, and then use anchor links to move between the individual pages. Or you could use JavaScript.

```html
<!-- add a button and some ids -->
<section>
  <h1 id='banner'>Default message for this banner</h1>
  <button id='changeMessage'>Update message</button>
</section>
```

```javascript
const banner = document.getElementById('banner')
const button = document.getElementById('changeMessage')

button.addEventListener('click', function(e) {
  banner.innerHTML = 'Some different message'
})
```

![Plain JS example](images/plain-js.gif)

The reason we need JavaScript here is because we've introduced ✨ state ✨ to the page. State is a value or list of values that you want to keep track of. In this example we now want the banner to display "a message" value, and to have a user action that can update that value and display the change in the page. With this simple JS example, I'm storing the state in the HTML itself. This was also usually how jQuery kept track of state, too.

```javascript
const $ = jQuery
const messages = [
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
];

$(document).ready(function () {
  const banner = $("#banner")
  $('#changeMessage').on('click', function() {
    const oldMessage = banner.text()
    banner.text(messages.shift())
    messages.push(oldMessage)
  })
})
```

In both of these examples so far, the "current message" is just whatever's in the HTML at a given time. There's no reason to worry about keeping the state in sync with the HTML--they're already in sync by default. For a lot of reasons that become clear as you build a bigger and bigger app, this kind of state management became unwieldy, so JavaScript frameworks emerged to help out.

### How Angular works, kind of

JS frameworks attempt to provide some ways to store your state, as well as your methods to change that state, in an organized way. If you're familiar with BackboneJS, it organized these things using models, collections, and views. With Angular, you have "components" (formerly directives), which are not much more than some config that ties together a template and a controller.

```html
// templates/banner.html
<div>
  <h1>{{ banner.message }}</h1>
  <button>Update message</button>
</div>
```

```javascript
// controllers/banner.js
export default class BannerCtrl {
  constructor() {
    this.message = 'Some default message'
  }
}

// components/banner.js
import template from '../templates/banner.html'
import BannerCtrl from '../controllers/banner'

export default {
  template,
  controller: BannerCtrl,
  controllerAs: 'banner'
}
```

Some main JS file will tie all these together into an Angular "module", but this is the basic mechanics. Notice that the values aren't stored in the HTML/DOM anymore, but on the controller instance here (e.g. `this.message`). The template (view) refers to that value using `{{ }}` braces, and Angular makes sure that the HTML is auto-updated any time that value changes. To make those changes, I'd provide a method on the controller class and reference it in the template, like this:

```javascript
// controllers/banner.js
const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default class BannerCtrl {
  constructor() {
    this.message = 'Some default message'
  }

  updateMessage() {
    const message = messages.shift()
    messages.push(this.message)
    this.message = message
  }
}
```

```html
// templates/banner.html
<div>
  <h1>{{ banner.message }}</h1>
  <button ng-click="banner.updateMessage()">Update message</button>
</div>
```

I'm using angular's `ng-click` attribute here to tap into the click event, during which I reference the controller as `banner` and call the new `updateMessage` method which rotates through the messages. Because the template is bound to a value stored in our state, when that controller value gets updated, Angular updates the HTML. It's everything you could ever want!

But what happens if updating the message is more complicated than just rotating through a hard-coded list? What if I want to make an API call to my super sweet banner message API to get a new message? In Angular, I'd probably define a "service" to make that easier.

```javascript
// services/messages.js
const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default class MessageService {

  /**
   * Could be an async HTTP call here...
   */
  get() {
    const msg = messages.shift()
    messages.push(msg)
    return msg
  }
}
```

In this example, I'm still just hard-coding the list, but this could easily be an async HTTP call shared between various places in the app. Now in the controller, I reference Angular's magical dependency injection* and grab the new service in the constructor so it can be called to get a new message value.

\*Try not to worry about this right now, `messageService` is just magically available like that

```javascript
export default class BannerCtrl {
  constructor(messageService) {
    this.message = ''
    this.messages = messageService
    this.updateMessage()
  }

  updateMessage() {
    this.message = this.messages.get()
  }
}
```

Here's the important thing to notice in this example: **When I call the service to get new data from the server and change the state, the return value of the service call comes back to the controller method, which then handles updating the controller's state**. If any other part of my app cares about this same data, I have to figure out how to share it, either by rearranging the app or by emitting events in controllers and listening in other controllers, etc. Of course this may not be a problem you run into often, but it's how Angular works.

### How react (and redux) works, kind of

A React app would also start with a component. Like Angular, it's basically a "template" and a "controller", but it's all contained in one class. The "template" part is represented here by the JSX returned in the class's `render` method (👋 Backbone), while the "controller" is basically the rest of the class.

If JSX freaks you out, read [Facebook's explanation](https://facebook.github.io/react/docs/jsx-in-depth.html).

```javascript
// components/banner.js
import React, { Component } from 'react'

class Banner extends Component {

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

export default Banner
```

This component reads from `this.state` and would make changes using `this.setState(key, value)`. Whenever the state is updated, the render method is called to re-render the "view". I could easily add an updateMessage function here that does the same logic that happened in the Angular example:

```javascript
class Banner extends Component {

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
        <button onClick={this.updateMessage.bind(this)}>Update message</button>
      </div>
    )
  }

  updateMessage() {
    const message = messages.shift()
    messages.push(this.state.message)
    this.setState('message', message)
  }
}
```

And that's basically the Angular example implemented in React. State updates are handled in the same way, too, where the result is handed back to the calling method which then has to set the new state. But then there's Flux.

### Uggggggggh what's flux what's redux why

Facebook [describes flux](https://facebook.github.io/flux/) like this:

> It complements React's composable view components by utilizing a unidirectional data flow. It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.

That description never helped me, to be honest. "More of a pattern" made it hard to practically sink my teeth into it. It really wasn't until I started playing with a _flavor_ or implementation of flux, called [Redux](http://redux.js.org/), that it finally started to click. "Unidirectional data flow" is pretty nice, it turns out.

Look at the React component from our previous example, adapted to work in a "flux way", using Redux.

```javascript
import React, { Component } from 'react'
import { updateMessage } from '../actions'

class Banner extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <button onClick={this.props.updateMessage}>Update message</button>
      </div>
    )
  }
}

export default Banner
```

To be fair, this wouldn't really work yet. But notice how the on click listener here doesn't do anything with its result. It doesn't wait for the new message and set it somewhere, it just says "update the message please thank you". In flux, that's called "an action". The update message action looks pretty familiar from the other examples:

```javascript
const messages = [
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message',
  'Default message for the banner'
]

export function updateMessage() {
  const message = messages.shift()
  messages.push(message)

  return {
    type: 'UPDATE_MESSAGE',
    payload: message
  }
}
```

The big difference here is what this method _returns_. That object with a `type` and a `payload` is the action. The `updateMessage` function is technically an "action creator", because calling it returns an action. But remember how the action isn't returned to the component ... so where does it go? I'll have to do a little more connecting in the component before that becomes clear:

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateMessage } from '../actions'

class Banner extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <button onClick={this.props.updateMessage}>Update message</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { message: state.message }
}

function bindActionCreators() {
  return { updateMessage }
}

export default connect(mapStateToProps, bindActionCreators)(Banner)
```

Two new functions here in the component: `mapStateToProps` (for reading state) and `bindActionCreators` (for updating state). The `connect` method allows the component to be connected to the single store where all of the redux state values are kept. This component only cares about `state.message`, so we "map" our state to our component and only give it the `state.message` value. Now we can reference `this.props.message` in our component JSX.

To update state, we need to bring in an action creator and connect it to our component so that redux knows about it. The `bindActionCreators` function just returns a hash of methods that should be registered with redux (will talk about that more in a second) and made available on the component's `this.props` as well.

So with these two funcdtions and the `connect` utility, this component is connected to the global redux state. When `this.props.updateMessage` is called in the onClick listener, the action creator returns this action:

```javascript
{
  type: 'UPDATE_MESSAGE',
  payload: message // some new message
}
```

Every single action created (so long as the action creator was registered with redux using the `connect` utility) is passed to a list of functions, kind of like event listeners, known as "reducers". This is the redux-specific part of the lesson. This app might have a message reducer that could look like this:

```javascript
export default (state = 'Default message for the banner', action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return action.payload

    default:
      return state
  }
}
```

This function would be called for _every_ action ever created by the app, so the `switch` statement specified which action types this reducer cares about. This lets reducers "listen" to any actions they want to listen to, which allows components to share access to any part of the global state, whenever they want.

We set up all of our reducers like this:

```javascript
import { combineReducers } from 'redux'
import MessageReducer from './message'

const reducers = {
  message: MessageReducer
}

export default combineReducers(reducers)
```

The `reducers` constant here is the global state object. `message` is a top-level key whose value is managed by the Message reducer, which by default returns "Default message for the banner", using JS default values. Any time an action of type 'UPDATE_MESSAGE' is called, the reducer expects the `payload` key to be the new message, and returns that value which replaces the old. Any components that are connected to that state value would be re-rendered.

### Buh guh
