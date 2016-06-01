import { Accounts } from 'meteor/accounts-base';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { name as authName } from '../auth';

console.log(`adding uiRouter as ${uiRouter} here`);

const moduleName = 'password';
export const name = `${authName}.${moduleName}`;

class Register {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      email: ''
    };

    this.error = '';
  }

  reset() {
    Accounts.forgotPassword(this.credentials, this.$bindToContext((err) => {
      if (err) {
        this.error = err;
      } else {
        this.$state.go('misas.parroquias.search');
      }
    }));
  }
}

// create a module
export default angular.module(
  `${name}`, 
  [
    angularMeteor,
    uiRouter
  ]
)
.component(
  `${moduleName}`, 
  {
    templateUrl: `imports/ui/components/auth/${moduleName}/${moduleName}.html`,
    controllerAs: name,
    controller: Register
  }
)
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('misas.password', {
    url: 'password/',
    template: '<password></password>'
  });
}
