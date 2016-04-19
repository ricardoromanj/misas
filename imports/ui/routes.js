import './components/parroquias/parroquias';
import './components/parroquia/parroquia';
import './components/parroquias/parroquias.search';
import './components/admin/sources/DHM/DHM-parse';

angular.module('parroquias').config(function($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $stateProvider.state('misas', {
    url: '/',
    views: {
      '@': {
        template: '<parroquias></parroquias>'
      }
    }
  }).state('misas.parroquias', {
    abstract: true,
    url: 'parroquias/',
    template: '<ui-view/>'
  }).state('misas.parroquias.search', {
    url: 'search',
    views: {
      '@misas': {
        template: '<parroquias-search></parroquias-search>'
      }
    }
  }).state('misas.parroquia', {
    url: 'parroquia/{id}',
    template: '<parroquia id="id"></parroquia>',
    controller: function($scope, $stateParams) {
      $scope.id = $stateParams.id;
      return console.log("parroquia state loaded");
    }
  }).state('misas.parroquia-edit', {
    url: 'parroquia/{id}/edit',
    template: '<parroquia-edit id="id"></parroquia-edit>',
    controller: function($scope, $stateParams) {
      $scope.id = $stateParams.id;
      return console.log("parroquia edit state loaded");
    }
  }).state('misas.admin', {
    url: 'admin/',
    templateUrl: 'imports/ui/components/admin/admin.html',
    controller: function($scope) {
      return console.log("admin");
    }
  }).state('misas.admin.dhm-parse', {
    url: 'dhm-parse/',
    controller: function($scope) {
      return console.log("dhm parsing");
    },
    views: {
      '@misas': {
        template: '<dhm-parse></dhm-parse>'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
});
