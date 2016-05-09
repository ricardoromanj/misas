import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import { name as userHelpersModule } from '../../../services/module';

const moduleName = 'settings';
export const name = `user.${moduleName}`;

class Settings {
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
      userHelpersModule
    ] 
)
.component(
    `${moduleName}`,
    {
      templateUrl: `imports/ui/components/user/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: Settings
    }
);
