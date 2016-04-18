import 'angular-ui-bootstrap';
import angular from 'angular';
import 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { Parroquias } from '../../../api/parroquias/collection';

console.log('Loaded parroquias!');

angular.module('parroquias', 
  [
    'angular-meteor', 
    'ui.router', 
    'ui.bootstrap',
    utilsPagination
  ]
);

angular.module('parroquias').directive('parroquias', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/components/parroquias/parroquias.html',
    controllerAs: 'psc',
    controller: function($scope, $reactive) {
      "ngInject";
      $reactive(this).attach($scope);
      return console.log('parroquias loaded');
    }
  };
});
