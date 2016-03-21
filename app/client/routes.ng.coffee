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
        views:
          #This targets <unnamed ui view>@<root state=parroquias>
          '@':
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
      .state(
        'admin'
        url: '/admin/'
        templateUrl: 'app/client/admin/views/admin.html'
        controller: ($scope)->
          console.log "admin"
      )
      .state(
        'admin.dhm-parse'
        url: 'dhm-parse/'
        controller: ($scope)->
          console.log "dhm parsing"
        views:
          #This targets <unnamed ui view>@<root state=parroquias>
          '@':
            template: '<dhm-parse></dhm-parse>'
      )
    $urlRouterProvider.otherwise('/')
    return
