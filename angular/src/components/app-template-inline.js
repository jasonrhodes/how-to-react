import angular from 'angular'
// import template from '../templates/app.html'
import banner from './banner'
import footer from './footer'

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack'
  }
}

export default angular.module('appComponent', [banner.name, footer.name])
  .component('app', {
    template: `
      <main>
        <banner></banner>
        <img src="/img/logo.png">
      </main>
      <app-footer url="app.url"></app-footer>
    `,
    controller: AppCtrl,
    controllerAs: 'app'
  })
