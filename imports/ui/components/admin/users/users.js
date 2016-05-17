import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import angularMessages from 'angular-messages';
import debounce from 'debounce';
import { cnameToComponentName } from '../../utils';
import { name as userHelpersModule } from '../../../services/module';

const moduleName = 'users';
export const name = `admin.${moduleName}`;
const componentName = cnameToComponentName(name); 

console.log(`loaded ${name} for component ${componentName} imports/ui/components/admin/${moduleName}/${moduleName}.html`);

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
  }
  _search(){
    //get a list of users based on the search field
    console.log(`searching ${this.q}`);
    Meteor.call('admin.users.search', { 
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
      this.$scope.$digest();
    });
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
    `${componentName}`,
    {
      templateUrl: `imports/ui/components/admin/${moduleName}/${moduleName}.html`,
      controllerAs: moduleName,
      controller: UsersAdmin
    }
);

