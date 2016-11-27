export default class BannerCtrl {
  constructor() {
    this.message = 'Default message for the banner'
    this.buttonText = 'Update Message'
    this.messages = [
      'A totally different random message',
      'This message maybe came from an async API call',
      'Wow this is another message'
    ]
  }

  updateMessage() {
    const oldMessage = this.message
    this.message = this.messages.shift()
    this.messages.push(oldMessage)
  }
}
