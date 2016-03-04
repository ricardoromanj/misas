if Meteor.isClient
  angular.module('parroquias').config ($urlRouterProvider, $stateProvider, $locationProvider) ->
    $locationProvider.html5Mode true
    $stateProvider
      .state(
        'parroquias'
        url: '/parroquias/'
        template: '<parroquias></parroquias>'
      )
      .state(
        'parroquias.search'
        url: 'search'
        template: '<parroquias-search></parroquias-search>'
      )
      .state(
        'parroquia'
        url: '/parroquia/{id}'
        template: '<parroquia id="id"></parroquia>'
        controller: ($scope, $stateParams)->
          $scope.id = $stateParams.id
          console.log "parroquia state loaded"
      )
    $urlRouterProvider.otherwise('/')
    return
