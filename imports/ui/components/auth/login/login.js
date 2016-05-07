import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import { name as authName } from '../auth';

const moduleName = 'login';
export const name = `${authName}.${moduleName}`;

class Login {
  constructor($scope, $reactive, $state, $log) {
    'ngInject';
 
    this.$state = $state;
    this.$log = $log;
 
    $reactive(this).attach($scope);
 
    this.credentials = {
      email: '',
      password: ''
    };
 
    this.error = '';
  }
  loginWithService(name) {
    if(name == null){
      this.$log.warn('You need to specify the name of the service for login');
      return false;
    }
    this.$log.info(`Loggin in with service ${name}`);
    let loginWithService = Meteor[`loginWith${_.capitalize(name)}`];
    if(loginWithService == null){
      this.$log.warn(`The specified service ${name} was not found`);
      return false;
    }
    loginWithService(
      {},
      this.$bindToContext((err) => {
        if(err) {
            this.error = err;
        } else {
            this.$state.go('misas.parroquias.search');
        }
      })
    ) 
    return true;
  }
  login() {
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
        } else {
          this.$state.go('misas.parroquias.search');
        }
      })
    );
  }
}

export default angular.module(
  `${name}`,
  [
    angularMeteor,
    ngMaterial
  ]
)
.component(
  `${moduleName}`,
  {
    templateUrl: `imports/ui/components/auth/${moduleName}/${moduleName}.html`,
    controllerAs: moduleName,
    controller: Login,
    replace: true
  }      
);

