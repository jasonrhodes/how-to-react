export default class BannerCtrl {
  constructor(messageService) {
    this.message = ''
    this.buttonText = 'Update message'
    this.messages = messageService
    this.updateMessage()
  }

  updateMessage() {
    this.message = this.messages.get()
  }
}
