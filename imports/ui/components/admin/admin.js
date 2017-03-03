import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
// ADMIN modules
import { name as AdminUsers } from './users/users';
import { name as AdminFixDHMImages } from './fixes/dhm-images/dhm-images';
import { name as AdminSourceDHMParse } from './sources/DHM/DHM-parse';
import { name as MisasUserHelpers } from '../../services/module';
// ADMIN html
import './users/users';
import './admin.html';
import '../user/user.html';
import './parroquias/parroquias.html';
import './sources/sources.html';
import './fixes/fixes.html';
//import './sources/DHM/DHM-parse';
export const name = `misas.admin`;
/**
 * Admin Module
 *
 * This module contains the routes for all Admin related components
 * , routes, and views. It also configures most general routes within
 * admin.
 */
export default angular.module(
    `${name}`,
    [
      uiRouter,
      MisasUserHelpers,
      AdminUsers,
      AdminFixDHMImages,
      AdminSourceDHMParse
    ] 
)
.config(
  ($stateProvider) => {
    'ngInject';
    $stateProvider.state('misas.admin', {
      url: 'admin/',
      templateUrl: 'imports/ui/components/admin/admin.html',
      resolve: {
        adminCheck: function(userHelpers){
          return userHelpers.checkIsRootP();
        }
      }
    });
    $stateProvider.state('misas.admin.sources', {
      url: 'sources/',
      resolve: {
        good: function(adminCheck){
          return true;
        }
      },
      controller: ($scope, $state) => {
        'ngInject';
        $scope.sources = {}; 
        $scope.sources.useSource = (source) => {
          if(_.isString(source)){
            $state.go(`misas.admin.sources.${source}`);
          }
        };
      },
      templateUrl: 'imports/ui/components/admin/sources/sources.html'
    });
    $stateProvider.state('misas.admin.fixes', {
      url: 'fixes/',
      resolve: {
        good: function(adminCheck){
          return true;
        }
      },
      controller: ($scope, $state) => {
        'ngInject';
        $scope.fixes = []; 
        $scope.fixes.useFix = (fix) => {
          if(_.isString(fix)){
            $state.go(`misas.admin.fixes.${fix}`);
          }
        };
      },
      templateUrl: 'imports/ui/components/admin/fixes/fixes.html'
    });
    $stateProvider.state(
      'misas.admin.users', 
      {
        url: 'users/',
        template: '<admin-users></admin-users>',
        resolve: {
          good: function(adminCheck){
            return true;
          }
        },
        controller: function(adminCheck){
        }
      }
    );
    $stateProvider.state('misas.admin.parroquias', {
      url: 'parroquias/',
      templateUrl: 'imports/ui/components/admin/parroquias/parroquias.html',
      resolve: {
        adminCheck: function(userHelpers){
          return userHelpers.checkIsRootP();
        }
      }
    });
  }
);

