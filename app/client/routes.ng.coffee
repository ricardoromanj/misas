if Meteor.isClient
  angular.module('misas').config ($urlRouterProvider, $stateProvider, $locationProvider) ->
    $locationProvider.html5Mode true
    $stateProvider
      .state( 
        'misas'                      
        url: '/'                 
        template: '<misas></misas>'
      )
      .state(
        'misas.search'
        url: '/search'
        template: '<misas-search></misas-search>'
      )
      .state(
        'misa'
        url: '/misa/:id'
        template: '<misa></misa>'
      )
    $urlRouterProvider.otherwise('/')
    return
