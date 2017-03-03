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
import NavigationSearch, { moduleName as subNavSearch } from '../navigation/search';
import { cnameToComponentName } from '../utils';
import './parroquias.search.html';
import './parroquias.search.pagination.html';
import googleLoaderService from '../../services/google.maps';
import utilsPagination from 'angular-utils-pagination';

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
  constructor($scope, $reactive, userHelpers, googleLoader) {
    'ngInject';
    console.log(`started ${componentName}`);
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    //map related stuff
    this.availableMap = false;
    this.showMap = true;
    this.google = null;
    googleLoader.promise.then((google) => {
      this.availableMap = true;
      this.google = google;
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
        scrollwheel: false
      });
    });
    //search related stuff
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
   * toggle maps show flag
   */
  toggleShowMap(){
    this.showMap = !(this.showMap);
    this.refreshMap();
  }
  /**
   * refresh map if the map is visible
   */
  refreshMap(){
    if(this.showMap){
      if(!_.isNil(this.google) && !_.isNil(this.map)){
        this.google.maps.event.trigger(this.map, 'resize');
      }
    }
  }
  /**
   * _search
   */
  _search(){
    //console.log(`searching ${this.q}`);
    this.call('parroquias.search', this.q, this.pageInfo, (error, result) => {
      if(error){
        throw error;
      }
      this._searched_parroquias = result.hits;
      this.numParroquias = result.total;
      //console.log(this._searched_parroquias);
    });
  }
  /**
   * This procedure is called every time the page is changed from within 
   * the pagination controls.
   */
  changePage(newPage){
    //console.log(newPage);
    this.pageInfo.page = newPage-1;
    this.search();
  }
}
/**
 * angular parroquias.search module is defined here
 */
export default angular.module(
    `${name}`,
    [
      angularMeteor,
      angularMeteorAuth,
      ngMaterial,
      ngMaterialTable,
			utilsPagination,
      angularMessages,
      googleLoaderService,
      NavigationSearch
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
  (
		$urlRouterProvider, 
		$stateProvider, 
		$locationProvider, 
		$mdIconProvider
	) => {
    "ngInject";
    $locationProvider.html5Mode(true);
		// setup the state misas.parroquias.search
    $stateProvider.state('misas.parroquias.search', {
      url: 'search',
      views: {
        /*'navigation.center@': {
          template: '<navigation-search></navigation-search>'
        },*/
        '@misas': {
          template: '<parroquias-search layout="column" flex>\
                     </parroquias-search>'
        }
      },
      resolve: {
        /**
         * wait for the google maps service to be resolved before showing the
         * page
         */
        'googleMaps': (googleLoader) => {
          console.log(googleLoader);
          return googleLoader.promise;
        }
      }
    });
  }
);

