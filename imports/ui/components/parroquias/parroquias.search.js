import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import ngSanitize from 'angular-sanitize';
import debounce from 'debounce';
import parroquias from './parroquias.js';
import { Parroquias } from '../../../api/parroquias/collection';
import NavigationSearch, { moduleName as subNavSearch } from '../navigation/search';
import { cnameToComponentName } from '../utils';
import './parroquias.search.html';
import './parroquias.search.pagination.html';
import googleLoaderService from '../../services/google.maps';
import utilsPagination from 'angular-utils-pagination';
import $ from 'jquery';
import _ from 'lodash';

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
  constructor($scope, $reactive, $sce, userHelpers, googleLoader) {
    'ngInject';
    console.log(`started ${componentName}`);
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    //map related stuff
    this.availableMap = false;
    this.showMap = false; 
    this.google = null;
    googleLoader.promise.then((google) => {
      this.availableMap = true;
      this.google = google;
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.6345, lng: -102.5528 },
        zoom: 4,
        scrollwheel: false
      });
    });
    this.markers = [];
    //map watcher for hide/show map so that it will be correctly visible
    $scope.$watch(
      () => {
        return $('#map').is(":visible");
      },
      (newValue, oldValue) => {
        console.log(`map is now ${newValue}`);
        if(newValue){
          this.refreshMap();
          this.displayResultsOnMap();
        }
      } 
    );
    //suggestions
    this.suggest = debounce(this._suggest, 200);
    this.suggestions = [];
    //search related stuff
    this.q = "";
    this._searched_parroquias = [];
    this.$scope = $scope;
    //this.search = debounce(this._search, 300);
    this.search = this._search;
    this.numParroquias = 0;
    this.pageInfo = {
      page: 0,
      perPage: 10
    }; 
    this.isSearching = false;
    this.search();
    this.$sce = $sce;
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
   * _suggest
   *
   * This function is debounced to 200ms and therefore will be called only
   * after the function suggest() has not been called in the last 200ms. This
   * function returns suggestions for the search field.
   */
  _suggest(){
    this.call('parroquias.search.suggest', this.q, (error, result) => {
      if(error){
        throw error;
      }
      if(_.isNil(result.options)){
        return;
      }
      //console.log(result.options);
      this.suggestions = result.options;
    });
  }
  /**
   * suggestionSelected
   *
   * When a suggestion is selected this will change the query text.
   */
  suggestionSelected(){
    if(_.isNil(this.selectedSuggestion) || _.isNil(this.selectedSuggestion.text)){
      return;
    }
    //console.log(`selected suggestion ${this.selectedSuggestion.text}`);
    this.q = this.selectedSuggestion.text;
    this.search();
  }
  /**
   * _search
   */
  _search(){
    //console.log(`searching ${this.q}`);
    this.isSearching = true;
    this.call('parroquias.search', this.q, this.pageInfo, (error, result) => {
      this.isSearching = false;
      if(error){
        throw error;
      }
      this._searched_parroquias = result.hits;
      this.numParroquias = result.total;
      //console.log(this._searched_parroquias);
      this.displayResultsOnMap();
    });
  }
  /**
   * displayResultsOnMap
   *
   * Check which results have lon/lat and display them on a map. The map
   * will be resized to fit the results
   */
  displayResultsOnMap(){
    // check we have a map and it is visible
    if(_.isNil(this.map) || !this.showMap || _.isNil(this.google)){
      //clean old parroquias on markers here
      this.clearMarkers();
      return;
    }
    // get all of the parroquias with locations
    if(!this._searched_parroquias || this._searched_parroquias.length <= 0){
      //clean old parroquias on markers here
      this.clearMarkers();
      return;
    }
    let locatedParroquias = _.filter(
      this._searched_parroquias,
      (parroquia) => {
        return (_.has(parroquia, 'location.lat') && 
                _.has(parroquia, 'location.lon'));
      }
    );
    // remove old markers
    this.clearMarkers();
    // add markers for each parroquias to map
    this.markers = _.map(
      locatedParroquias,
      (parroquia) => {
        let pLocation = parroquia.location;
        let location = {
          lat: _.toNumber(pLocation.lat),
          lng: _.toNumber(pLocation.lon)
        }; 
        return new this.google.maps.Marker({
          position: location,
          map: this.map,
          title: parroquia.name    
        });
      }
    );
    // change map to fit markers
    let bounds = new this.google.maps.LatLngBounds();
    for(let marker of this.markers){
      bounds.extend(marker.getPosition());
    }
    this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);
  }
  /**
   * clearMarkers
   *
   * removes all markers from the map
   */
  clearMarkers(){
    for(let marker of this.markers){
      marker.setMap(null);
    }
    this.markers = [];
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
      ngSanitize,
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

