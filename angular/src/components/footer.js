import template from '../templates/footer.html'

export default angular.module('footerComponent', [])
  .component('appFooter', {
    template,
    bindings: {
      url: '<'
    }
  })
