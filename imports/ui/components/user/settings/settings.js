import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import { name as userHelpersModule } from '../../../services/module';
import './settings.html';

const moduleName = 'settings';
export const name = `user.${moduleName}`;

class Settings {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    this.isChangingPassword = false;
  }
  startChangePassword(){
    this.isChangingPassword = true;
    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordCheck = '';
  }
  endChangePassword(){
    this.isChangingPassword = false;
  }
  checkSamePassword(){
    return (this.newPassword == this.newPasswordCheck);
  }
  changePassword(){

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
    `${moduleName}`,
    {
      templateUrl: `imports/ui/components/user/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: Settings
    }
);
