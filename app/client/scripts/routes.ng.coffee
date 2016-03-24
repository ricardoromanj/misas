angular.module('parroquias').config ($urlRouterProvider, $stateProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $stateProvider
    .state(
      'parroquias'
      url: '/parroquias/'
      template: '<parroquias></parroquias>'
    )
    .state(
      'parroquias.create'
      url: 'create'
      views:
        '@':
          template: '<parroquias-form formtype="mini"></parroquias-form>'
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
  $urlRouterProvider.otherwise('/')
  return
