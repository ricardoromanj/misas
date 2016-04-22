// import 'angular-ui-bootstrap';
import ngMaterial from 'angular-material';
import utilsPagination from 'angular-utils-pagination';
import { Parroquias } from '../../../api/parroquias/collection';
import 'angular-ui-router';


console.log('Loaded parroquias!');

angular.module('parroquias', 
  [
    'angular-meteor', 
    'ui.router', 
    //'ui.bootstrap',
    'ngMaterial',
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
