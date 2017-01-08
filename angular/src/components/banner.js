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
