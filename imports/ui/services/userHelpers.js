import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import angular from 'angular';
import { name as ServicesModule } from './module';
import 'angular-meteor';
 
export const name = 'misas.services';

console.log("Loaded users");

angular.module(
  ServicesModule
).factory(
  'userHelpers',
  function userHelpersFactory($q) {
    "ngInject";
    var checkIsRoot = () => {
      let userId = Meteor.userId();
      if(userId != null){
        return Roles.userIsInRole(userId, ['root'], Roles.GLOBAL_GROUP);
      }
      return false;
    };
    var checkIsRootP = () => {
      if(checkIsRoot()){
        return $q.resolve();
      }else{
        return $q.reject('AUTH_REQUIRED');
      }
    }
    var checkIsLoggedIn = () => {
      return !!Meteor.userId();
    };
    return {
      checkIsRoot: checkIsRoot,
      checkIsRootP: checkIsRootP,
      checkIsLoggedIn(){
        var deferred = $q.deferred();
        if (Meteor.userId() != null) {
          return deferred.resolve(Meteor.user());
        }
        else
        {
          return deferred.reject('AUTH_REQUIRED');
        }
      },
      /* Some useful helper methods */
      setupUserHelpers(vm) {
        vm.checkIsRoot = checkIsRoot;
        vm.checkIsLoggedIn = checkIsLoggedIn;
        vm.helpers({
          currentUser() {
            return Meteor.user(); 
          },
          currentUserId() {
            return Meteor.userId();
          },
        });
      }
    };
  }
);

