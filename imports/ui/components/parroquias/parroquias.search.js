import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import debounce from 'debounce';
import parroquias from './parroquias.js';
import { Parroquias } from '../../../api/parroquias/collection';
import { cnameToComponentName } from '../utils';
import './parroquias.search.html';

const moduleName = 'parroquias.search';
export const name = `${moduleName}`;
const componentName = cnameToComponentName(name); 
console.log('Loaded parroquias directive!');
/**
 * ParroquiasSearch
 *
 * Class used to represent the parroquiasSearch component in angular. This 
 * component searches for parroquias in different ways and shows the results
 * to any user.
 *
 */
class ParroquiasSearch {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    console.log(`started ${componentName}`);
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    this.q = "";
    this._searched_parroquias = [];
    this.$scope = $scope;
    this.search = debounce(this._search, 300);
    this.numParroquias = 0;
    this.pageInfo = {
      page: 0,
      perPage: 10
    }; 
    this._search();
  }
  /**
   * _search
   */
  _search(){
    console.log(`searching ${this.q}`);
    this.call('parroquias.search', this.q, this.pageInfo, (error, result) => {
      if(error){
        throw error;
      }
      this._searched_parroquias = result.hits;
      this.numParroquias = result.total;
      console.log(this._searched_parroquias);
    });
  }
  changePage(newPage){
    console.log(newPage);
    this.pageInfo.page = newPage;
    this.search();
  }
}

export default angular.module(
    `${name}`,
    [
      angularMeteor,
      angularMeteorAuth,
      ngMaterial,
      ngMaterialTable,
      angularMessages
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: 
        `imports/ui/components/parroquias/${moduleName}.html`,
      controllerAs: 'search',
      controller: ParroquiasSearch 
    }
).config(
  ($urlRouterProvider, $stateProvider, $locationProvider, $mdIconProvider) => {
    "ngInject";
    $locationProvider.html5Mode(true);
    $stateProvider.state('misas.parroquias.search', {
      url: 'search',
      views: {
        '@misas': {
          template: '<parroquias-search></parroquias-search>'
        }
      }
    });
  }
);

