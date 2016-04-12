angular.module('parroquias').config(function($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $stateProvider.state('parroquias', {
    url: '/parroquias/',
    template: '<parroquias></parroquias>'
  }).state('parroquias.search', {
    url: 'search',
    views: {
      '@': {
        template: '<parroquias-search></parroquias-search>'
      }
    }
  }).state('parroquia', {
    url: '/parroquia/{id}',
    template: '<parroquia id="id"></parroquia>',
    controller: function($scope, $stateParams) {
      $scope.id = $stateParams.id;
      return console.log("parroquia state loaded");
    }
  }).state('admin', {
    url: '/admin/',
    templateUrl: 'app/client/admin/views/admin.html',
    controller: function($scope) {
      return console.log("admin");
    }
  }).state('admin.dhm-parse', {
    url: 'dhm-parse/',
    controller: function($scope) {
      return console.log("dhm parsing");
    },
    views: {
      '@': {
        template: '<dhm-parse></dhm-parse>'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
});
