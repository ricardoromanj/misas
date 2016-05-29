import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import debounce from 'debounce';
//import parroquias from './parroquias.js';
import { Parroquias } from '../../../api/parroquias/collection';
import pubsubService from '../../services/pubsub';
import { cnameToComponentName } from '../utils';
import './search.html';

export const name = `search`;
export const moduleName = `navigation.${name}`;
const componentName = cnameToComponentName(moduleName); 
console.log('Loaded navigation search directive!');
/**
 * NavigationSearch
 *
 * This class shows a search field in the navigation which one can subscribe to
 * get updates whenever the text changes in that field. 
 *
 * In order to have this work you must place this component in the state
 * '' (or root) with view name 'navigation.center'. This can be done as follows
 * when declaring a state.
 *
 * views: {
 *   'navigation.center@': {
 *     template: '<navigation-search></navigation-search>'
 *   }
 * }
 *
 * To place other components in the navigation center position you would do the
 * same.
 */
class NavigationSearch {
  /**
   * adds angular meteor, 
   */
  constructor($scope, $reactive, userHelpers, pubsub) {
    'ngInject';
    console.log(`started ${componentName}`);
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    this.q = "";
    this._searched_parroquias = [];
    this.$scope = $scope;
    //this.search = debounce(this._search, 300);
    this.numParroquias = 0;
    this.pageInfo = {
      page: 0,
      perPage: 10
    }; 
    //this._search();
    this.pubsub = pubsub;
    console.log(`publishing to ${moduleName}`);
    this.pubsub.publish(moduleName, {
      status: 'created'
    });
  }
  /**
   * _search
   */
  search(){
    console.log(`publishing to ${moduleName}`);
    this.pubsub.publish(moduleName, {
      status: 'write'
    });
    /*
    this.call('parroquias.search', this.q, this.pageInfo, (error, result) => {
      if(error){
        throw error;
      }
      this._searched_parroquias = result.hits;
      this.numParroquias = result.total;
      console.log(this._searched_parroquias);
    });
    */
  }
  changePage(newPage){
    console.log(newPage);
    this.pageInfo.page = newPage-1;
    this.search();
  }
}
/**
 * creates angular module for navigation.search
 */
angular.module(
    `${moduleName}`,
    [
      angularMeteor,
      angularMeteorAuth,
      ngMaterial,
      ngMaterialTable,
      angularMessages,
      pubsubService
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: 
        `imports/ui/components/navigation/${name}.html`,
      controllerAs: 'search',
      controller: NavigationSearch 
    }
);

export default moduleName;
