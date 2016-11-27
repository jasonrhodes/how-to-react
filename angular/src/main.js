import angular from 'angular'
import './style/app.css'

import app from './components/app'
import banner from './components/banner'
import footer from './components/footer'

angular.module('app', [])
  .component('app', app)
  .component('banner', banner)
  .component('appFooter', footer)
