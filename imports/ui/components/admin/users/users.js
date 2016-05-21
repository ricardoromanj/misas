import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngMaterialTable from 'angular-material-data-table';
import debounce from 'debounce';
import { cnameToComponentName } from '../../utils';
import { name as userHelpersModule } from '../../../services/module';
import './users.html';

const moduleName = 'users';
export const name = `admin.${moduleName}`;
const componentName = cnameToComponentName(name); 
/**
 * UsersAdmin
 *
 * Component class for a searchable user administration panel. This panel 
 * allows the administrators to delete users, add users, and edit them. 
 */
class UsersAdmin {
  constructor($scope, $reactive, userHelpers) {
    'ngInject';
    console.log('started UsersAdmin');
    $reactive(this).attach($scope);
    userHelpers.setupUserHelpers(this);
    this.q = "";
    this._searched_users = [];
    this.$scope = $scope;
    this.search = debounce(this._search, 300);
    this.selected = []
    this.promise = true
  }
  /**
   * _search
   *
   * This method when called will query the server for users that match the 
   * property q (for query) and will return a paged result to be displayed to 
   * administrators.
   */
  _search(){
    //get a list of users based on the search field
    console.log(`searching ${this.q}`);
    this.call('admin.users.search', { 
      query: {
        match: {
          _all: this.q 
        }
      }
    }, {
      page: 0,
      per_page: 10
    }, (error, searched_users) => {
      console.log(`got searched users`);
      if(error){
        throw error;
      } 
      //TODO: subscribe with the new users in meteor
      this._searched_users = searched_users; 
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
      angularMessages
    ] 
)
.component(
    `${componentName}`,
    {
      templateUrl: 
        `imports/ui/components/admin/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: UsersAdmin
    }
);

