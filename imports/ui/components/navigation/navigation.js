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

const name = 'navigation';
const moduleName = `misas.${name}`;

console.log('initializing navigation module');

/**
 * Navigation
 * 
 * This class handles all of the actions on the navigation bar of misas
 *
 */
class Navigation {
  /**
   * adds angular meteor,
   */
  constructor($scope, $reactive, $state, $log, userHelpers){
      'ngInject';
      //directive options
      $reactive(this).attach($scope);
      vm = this;
      userHelpers.setupUserHelpers(vm);
      //instance variables to be used
      this.$state = $state;
      this.$log = $log;
      console.log('navigation loaded');
  }
  /**
   * logout
   *
   * logs out the user from authenticated session
   */
  logout(){
    Meteor.logout((err) => {
      if(err != null){
        this.$log.error(err);  
        return;
      }  
      //$state.reload();
      this.$state.go('misas');
    })  
  }
  /**
   * openMenu
   *
   * opens the menu that shows logi, profile, and settings
   */
  openMenu($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  } 
}
/**
 * create the module and add it's dependencies 
 */
angular.module(moduleName, [])
.directive('navigation', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/components/navigation/navigation.html',
    controllerAs: 'vm',
    replace: true,
    controller: Navigation 
  };
});
/**
 * export the module name as this is used for import
 */
export default moduleName;
