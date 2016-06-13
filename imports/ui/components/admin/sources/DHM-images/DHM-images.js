import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import debounce from 'debounce';
import { cnameToComponentName } from '../../../utils';
import { name as userHelpersModule } from '../../../../services/module';
import './DHM-images.html';

const moduleName = 'dhm-images';
export const name = `admin.${moduleName}`;
const componentName = cnameToComponentName(moduleName); 
/**
 * UsersAdmin
 *
 * Component class for a searchable user administration panel. This panel 
 * allows the administrators to delete users, add users, and edit them. 
 */
class DHMImages {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    $reactive(this).attach($scope);
    //userHelpers.setupUserHelpers(this);
  }
}

export default angular.module(
    `${name}`,
    [
      angularMeteor,
      angularMeteorAuth,
      userHelpersModule,
      ngMaterial,
      ngMaterialTable,
      uiRouter,
      angularMessages
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: 
        `imports/ui/components/admin/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: DHMImages 
    }
).config(
  ($stateProvider) => {
    'ngInject';
    $stateProvider.state('misas.admin.sources.dhm-images', {
      url: 'search',
      templateUrl: 'imports/ui/components/admin/sources/DHM-images/DHM-images.html'
    });
  }
);

