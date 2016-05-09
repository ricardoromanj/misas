// import 'angular-ui-bootstrap';
import ngMaterial from 'angular-material';
import utilsPagination from 'angular-utils-pagination';
import angular from 'angular';
import angularMeteorAuth from 'angular-meteor-auth';
import 'angular-ui-router';
import { Parroquias } from '../../../api/parroquias/collection';
import { name as ServicesModule } from '../../services/module';
import '../../services/userHelpers';
import { name as loginModule } from '../auth/login/login';
import { name as passwordModule } from '../auth/password/password';
import { name as userSettingsModule } from '../user/settings/settings';


console.log('initializing parroquias module');

export default angular.module('parroquias', 
  [
    'angular-meteor', 
    'angular-meteor.auth',
    'ui.router', 
    'accounts.ui',
    'ngMaterial',
    ServicesModule,
    utilsPagination,
    loginModule,
    passwordModule,
    userSettingsModule
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
