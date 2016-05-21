// import 'angular-ui-bootstrap';
import { Meteor } from 'meteor/meteor';
import ngMaterial from 'angular-material';
import utilsPagination from 'angular-utils-pagination';
import angular from 'angular';
import 'angular-ui-router';
import { Parroquias } from '../../../api/parroquias/collection';
import { name as ServicesModule } from '../../services/module';
import '../../services/userHelpers';
import { name as loginModuleName } from '../auth/login/login';
import { parroquiasModule } from '../parroquias/parroquias';
import './navigation.html';
//import 'imports/ui/components/parroquias/parroquias.html';


console.log('initializing navigation module');

angular.module('parroquias').directive('navigation', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/components/navigation/navigation.html',
    controllerAs: 'vm',
    replace: true,
    controller: function($scope, $reactive, $state, $log, userHelpers) {
      "ngInject";
      var vm;
      $reactive(this).attach($scope);
      vm = this;
      userHelpers.setupUserHelpers(vm);
      vm.logout = () => {
        Meteor.logout((err) => {
          if(err != null){
            $log.error(err);  
            return;
          }  
          //$state.reload();
          $state.go('misas');
        })  
      }
      vm.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      }; 
      return console.log('navigation loaded');
    }
  };
});
