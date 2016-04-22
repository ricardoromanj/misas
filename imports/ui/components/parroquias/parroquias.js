// import 'angular-ui-bootstrap';
import ngMaterial from 'angular-material';
import utilsPagination from 'angular-utils-pagination';
import 'angular-ui-router';
import { Parroquias } from '../../../api/parroquias/collection';
import '../../services/user';


console.log('Loaded parroquias!');

angular.module('parroquias', 
  [
    'angular-meteor', 
    'ui.router', 
    //'ui.bootstrap',
    'accounts.ui',
    'ngMaterial',
    'misas.users',
    utilsPagination
  ]
);

angular.module('parroquias').directive('parroquias', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/components/parroquias/parroquias.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, user) {
      "ngInject";
      var vm;
      $reactive(this).attach($scope);
      vm = this;
      user.setupUserHelpers(vm);
      return console.log('parroquias loaded');
    }
  };
});
