# how-to-react
Remembering how I finally made sense of react

It took me a long time to even start to grasp what react is and how it would really work for a serious application. I've just started to get my head around the edges of an app that pulls together React, Redux, redux-thunk, react-router, and some other things so I want to get those notes together in a mini-guide, if for no other reason than to walk myself through it all again when I'm confused in 6 weeks.

![Demo example gif](images/how-to-react-demos.gif)

### How a JavaScript app works

Note: If you understand Angular, skip to that section.

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

What HTML isn't good at is changing things. If you wanted, for some reason, to let a user change the banner message here, you'd have to create new HTML pages with each different banner, and then links to the individual pages. Or you could use JavaScript.

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

The reason we need JavaScript here is because we've introduced ✨ state ✨ to the page. We now want the banner to display "a message" value, and to have a user action that can update that value and display the change in the page. That's how all JS frameworks work, basically. With this simple JS example, I'm storing the state in the HTML itself. This was often how jQuery apps worked.

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

The "current message" is just whatever's in the HTML at a given time, so we don't have to worry about keeping the state in sync with the HTML--they're already in sync by default. But keeping state in the DOM like this gets messy and hard to maintain as your app gets bigger. Even in this jQuery app, we've moved _some_ of our state out of the HTML/DOM and into the file itself (the list of available messages to rotate through).

### How an Angular app works, kind of

JS frameworks attempt to provide some ways to store your state, as well as your methods to change that state, in an organized way. If you're familiar with BackboneJS, it did this using models, collections, and views to try to separate and organize the various pieces. With Angular, you have "components" (formerly directives), which are not much more than some config that ties together a template and a controller.

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

Some main JS file will tie all these together using angular's methods, but this is the basic organization. Values aren't stored in the HTML/DOM, but on the controller itself here (e.g. `this.message`), and then the template refers to that value so that the HTML is auto-updated any time the value changes. To make change possible, we'd add a method on the controller class and reference it in the template:

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

We use angular's `ng-click` attribute to tap into the click event, and reference the controller as `banner`, calling the new `updateMessage` method which rotates through the messages. We've tied our template to a value stored in our state, and then updated that state, which updates the HTML. Everything you could ever want.

Except what happens if updating the message is more complicated than just rotating through a hard-coded list? What if you want to make an API call to your sweet banner message API to get a new message? In Angular, you'd usually define a "service" for that.

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

In this example, we're still just hard-coding the list, but you get the point. Now in our controller, we reference Angular's magical dependency injection and grab our new service in our constructor so we can use it to populate our message value.

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

**When you call the service to get new data from the server and change the state, the return value of the service call comes back to the controller method, which itself handles updating the state**. (<-- That's really important to understand going forward, FWIW.) So imagine if you wanted to have a footer on this page, and have it be a separate component, but for whatever reason you wanted it to also reference this message. How do you keep it in sync?

You'd probably have to move some of this logic up to a shared component or controller, and then pass the message down into the sub-components so it could be shared. Or you could emit some kind of event inside of `updateMessage` here and have other components listening for that event, updating their copy of state with the new value as well. Neither one is an especially great solution, in my opinion.

### How react (and redux) works, kind of

With React, we start with a component. Like Angular, it's basically a "template" and a "controller", but it's all contained in one class. The "template" part is represented by the JSX primarily returned in the class's `render` method (hi Backbone), while the "controller" part is the rest of the class.

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

This component reads its state from `this.state` and would change state with `this.setState(key, value)`. Whenever the state is updated, the render method is called to re-render the "view". We could easily add an updateMessage function here that does the same logic we did with Angular:

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

And we'd basically have the Angular example implemented in React. But then there's Flux.

(To be continued)
