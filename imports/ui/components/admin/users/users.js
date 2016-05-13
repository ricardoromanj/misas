import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import { cnameToComponentName } from '../../utils';
import { name as userHelpersModule } from '../../../services/module';

const moduleName = 'users';
export const name = `admin.${moduleName}`;
const componentName = cnameToComponentName(name); 

console.log(`loaded ${name} for component ${componentName} imports/ui/components/admin/${moduleName}/${moduleName}.html`);

class UsersAdmin {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
  }
}

export default angular.module(
    `${name}`,
    [
      angularMeteor,
      angularMeteorAuth,
      userHelpersModule,
      angularMessages
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: `imports/ui/components/admin/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: UsersAdmin
    }
);

