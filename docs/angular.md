### Managing state with Angular 1.5+ components

JS frameworks attempt to provide some ways to store your state, as well as your methods to change that state, in an organized way. If you're familiar with BackboneJS, it organized these things using models, collections, and views. With Angular, you have "components" (formerly directives), which are not much more than some config that ties together an HTML template and a controller class.

The banner template:
```html
<div>
  <h1>{{ banner.message }}</h1>
  <button>Update message</button>
</div>
```

The banner component:
```javascript
import template from '../templates/banner.html'

class BannerCtrl {
  constructor() {
    this.message = 'Some default message'
  }
}

export default angular.module('bannerComponent', [])
  .component('banner', {
    template,
    controller: BannerCtrl,
    controllerAs: 'banner'
  })
```

Notice how the values aren't stored in the HTML anymore, but on the controller instance here (e.g. `this.message`). The template (view) refers to that value using `{{ }}` braces, and Angular makes sure that the HTML is auto-updated any time that value changes. To make those changes, I'd provide a method on the controller class and reference it in the template, like this:

```javascript
import template from '../templates/banner.html'

const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

class BannerCtrl {
  constructor() {
    this.message = 'Some default message'
  }

  updateMessage() {
    const message = messages.shift()
    messages.push(this.message)
    this.message = message
  }
}

export default angular.module('bannerComponent', [])
  .component('banner', {
    template,
    controller: BannerCtrl,
    controllerAs: 'banner'
  })
```

And then reference the new controller method from the template:
```html
<div>
  <h1>{{ banner.message }}</h1>
  <button ng-click="banner.updateMessage()">Update message</button>
</div>
```

This uses angular's `ng-click` attribute to tap into the click event, during which I reference the controller as `banner` and call the new `updateMessage` method which rotates through the messages. Because the template is bound to a value stored in our state, when that controller value gets updated, Angular updates the HTML.

This works, but it's a good idea to move the message handling logic out of the controller (better organization, reuse, etc). Here's a simple message service:

```javascript
const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default class {

  get() {
    const msg = messages.shift()
    messages.push(msg)
    return msg
  }

}
```

Now the component can import the message service, depend on it in the angular module and then use it in the component controller's `updateMessage` method:

```javascript
import angular from 'angular'
import template from '../templates/banner.html'
import messageService from '../services/messages'

class BannerCtrl {
  constructor(messages) {
    this.message = ''
    this.buttonText = 'Update message'
    this.messages = messages
    this.updateMessage()
  }

  updateMessage() {
    this.message = this.messages.get()
  }
}

export default angular.module('bannerComponent', [messageService.name])
  .component('banner', {
    template,
    controller: BannerCtrl,
    controllerAs: 'banner'
  })

```

Take a look at [the Angular example code](../angular) to see how this all works together.

Next: [React is kind of like Angular](react.md)
