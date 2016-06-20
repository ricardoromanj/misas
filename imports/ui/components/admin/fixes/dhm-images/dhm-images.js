import { Meteor } from 'meteor/meteor';
import { FixJob, FixJobStatus } from '../../../../../api/admin/fixes/fix-job';
import { Name } from '../../../../../api/admin/fixes/DHM-images-fix-job-info';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import debounce from 'debounce';
import _ from 'lodash';
import { cnameToComponentName } from '../../../utils';
import { name as userHelpersModule } from '../../../../services/module';
import './dhm-images.html';

const moduleName = 'dhm-images';
export const name = `admin.fix.${moduleName}`;
const componentName = cnameToComponentName(name); 
/**
 * DHMImagesFix
 *
 * This class calls a meteor method that start a job which
 * process all of the parroquias and for each it downloads
 * an image if found on DHM.
 */
class DHMImagesFix {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    $reactive(this).attach($scope);
    //userHelpers.setupUserHelpers(this);
    this.helpers({
      'FixJob': () => {
        return FixJob.findOne({}); 
      }
    });
    console.log(`FixJob: ${Name}`);
    this.subscribe('misas.admin.fixes.fixjob', () => {
      return [ Name ];
    });
  }
  startJob(){
    console.log(`calling DHM-images fix`);
    this.call('misas.admin.fixes.fixjob.start', Name, (error, result) => {
      if(!_.isNil(error)){
        console.log(error);
        return;
      }
      console.log(`started DHM-images fix`);
    });
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
        `imports/ui/components/admin/fixes/${moduleName}/${moduleName}.html`,
      controllerAs: 'fix',
      controller: DHMImagesFix
    }
).config(
  ($stateProvider) => {
    'ngInject';
    $stateProvider.state('misas.admin.sources.dhm-images', {
      url: 'dhm-images/',
      template: '<admin-fix-dhm-images></admin-fix-dhm-images>'
    });
  }
);

