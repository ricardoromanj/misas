import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import uiRouter from 'angular-ui-router';
import { Parroquias } from '../../../api/parroquias/collection';
import { name as MisasServices } from '../../services/module';
import { name as MisasUserLogin } from '../auth/login/login';
import { name as MisasUserPassword } from '../auth/password/password';
import { name as MisasUserSettings } from '../user/settings/settings';
import { name as MisasParroquiasSearch } from './parroquias.search';
import { name as MisasAdmin } from '../admin/admin';
import MisasNavigation from '../navigation/navigation';
import '../../services/userHelpers';
import './parroquias.html';


console.log('initializing parroquias module');

export default angular.module('parroquias', 
  [
    'angular-meteor', 
    angularMeteorAuth,
    uiRouter, 
    'accounts.ui',
    ngMaterial,
    ngMaterialTable,
    MisasNavigation,
    MisasServices,
    MisasUserLogin,
    MisasUserPassword,
    MisasUserSettings,
		MisasParroquiasSearch,
    MisasAdmin
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
