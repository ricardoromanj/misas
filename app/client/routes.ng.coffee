if Meteor.isClient
  angular.module('parroquias').config ($urlRouterProvider, $stateProvider, $locationProvider) ->
    $locationProvider.html5Mode true
    $stateProvider
      .state(
        'parroquias'
        url: '/'
        template: '<parroquias></parroquias>'
      )
      .state(
        'parroquias.search'
        url: '/search'
        template: '<parroquias-search></parroquias-search>'
      )
      .state(
        'parroquia'
        url: '/parroquia/:id'
        template: '<parroquia></parroquia>'
      )
    $urlRouterProvider.otherwise('/')
    return
