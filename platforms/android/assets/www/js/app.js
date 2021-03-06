// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.service', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('assentamento', {
    url: '/assentamento',
    templateUrl: 'templates/assentamento.html',
    controller: 'assentamentoCtrl'

  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'

  })

  .state('vistoria', {
    url: '/vistoria',
    templateUrl: 'templates/vistoria.html',
    controller: 'vistoriaCtrl'
  })

  .state('multas', {
    url: '/multas',
    templateUrl: 'templates/multas.html',
    controller: 'multasCtrl'
  })

  .state('solicitacao', {
    url: '/solicitacao',
    templateUrl: 'templates/solicitacao.html',
    controller: 'solicitacaoCtrl'
  })

  .state('numero', {
    url: '/numero',
    templateUrl: 'templates/numero.html',
    controller: 'numeroCtrl'
  })

  .state('apoio', {
    url: '/apoio',
    templateUrl: 'templates/apoio.html',
    controller: 'apoioCtrl'
  });

  
  $urlRouterProvider.otherwise('/login');

});