import { Meteor } from 'meteor/meteor';
// npm packages
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import _ from 'lodash';
// utils
import { cnameToComponentName } from '../../../utils';
import { name as userHelpersModule } from '../../../../services/module';
// fix job information
import { FixJob, FixJobStatus } from '../../../../../api/admin/fixes/fix-job';
import { Name } from '../../../../../api/admin/fixes/DHM-images-fix-job-info';
// html
import '../fix-job.html';

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
      'fixJob': () => {
        return FixJob.findOne({}); 
      }
    });
    this.subscribe('misas.admin.fixes.fixjob', () => {
      return [ Name ];
    });
  }
  startJob(){
    this.call('misas.admin.fixes.fixjob.start', Name, (error, result) => {
      if(!_.isNil(error)){
        console.log(error);
        return;
      }
    });
  }
}

export default angular.module(
    `${name}`,
    [
      angularMeteor,
      userHelpersModule,
      ngMaterial,
      uiRouter
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: 
        `imports/ui/components/admin/fixes/fix-job.html`,
      controllerAs: 'fix',
      controller: DHMImagesFix
    }
).config(
  ($stateProvider) => {
    'ngInject';
    $stateProvider.state('misas.admin.fixes.dhm-images', {
      url: 'dhm-images/',
      template: '<admin-fix-dhm-images></admin-fix-dhm-images>'
    });
  }
);

