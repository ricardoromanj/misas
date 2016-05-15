// import 'angular-ui-bootstrap';
import ngMaterial from 'angular-material';
import utilsPagination from 'angular-utils-pagination';
import angular from 'angular';
import angularMeteorAuth from 'angular-meteor-auth';
import uiRouter from 'angular-ui-router';
//import uiRouterLogger from 'ui-router-logger';
import { Parroquias } from '../../../api/parroquias/collection';
import { name as ServicesModule } from '../../services/module';
import '../../services/userHelpers';
import { name as loginModule } from '../auth/login/login';
import { name as passwordModule } from '../auth/password/password';
import { name as userSettingsModule } from '../user/settings/settings';
import { name as adminUsersModule } from '../admin/users/users';


console.log('initializing parroquias module');

export default angular.module('parroquias', 
  [
    'angular-meteor', 
    angularMeteorAuth,
    uiRouter, 
    //uiRouterLogger,
    'accounts.ui',
    'ngMaterial',
    ServicesModule,
    utilsPagination,
    loginModule,
    passwordModule,
    userSettingsModule,
    adminUsersModule
  ]
);

angular.module('parroquias').directive('parroquias', function() {
  return {
    restrict: 'E',
    templateUrl: 'imports/ui/components/parroquias/parroquias.html',
    controllerAs: 'vm',
    replace: true,
    controller: function($scope, $reactive, userHelpers) {
      "ngInject";
      var vm;
      $reactive(this).attach($scope);
      vm = this;
      userHelpers.setupUserHelpers(vm);
      return console.log('parroquias loaded');
    }
  };
});
