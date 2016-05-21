import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import angular from 'angular';
import { name as ServicesModule } from './module';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';
import 'angular-meteor';
 
export const name = 'misas.services';

console.log("Loaded users");

angular.module(
  ServicesModule
).factory(
  'userHelpers',
  function userHelpersFactory($q, $auth) {
    "ngInject";
    var hasEmail = (userI = null) => {
      let user =  Meteor.user();
      if(!_.isNil(userI)){
        user = userI;
      }
      if(user == null || user.emails == null){
        return false;
      }
      if(user.emails.length <= 0){
        return false;
      } 
      return true;
    };
    var hasName = (userI = null) => {
      let user =  Meteor.user();
      if(!_.isNil(userI)){
        user = userI;
      }
      if(user == null){
        return false;
      }
      if(user.profile == null || user.profile.name == null){
        return false;
      } 
      return true;
    };
    var checkIsRoot = () => {
      let userId = Meteor.userId();
      if(userId != null){
        return Roles.userIsInRole(userId, ['root'], Roles.GLOBAL_GROUP);
      }
      return false;
    };
    var checkIsRootP = () => {
      let deferred = $q.defer();
      $auth.awaitUser().then(
        (user) => {
          console.log('checkIsRootP()');
          console.log(user);
          if(!_.has(user, 'roles')){
            //if roles is not defined in the user, then check in the server to
            //see if the given user has thoser permissions
            Meteor.call('misas.users.checkIsRoot', (error, result) => {
              if(!_.isNil(error)){
                deferred.reject('AUTH_REQUIRED');
                return;
              }
              if(!_.isBoolean(result) || !result){
                deferred.reject('AUTH_REQUIRED');
                console.log('AUTH_REQUIRED');
                return;
              }
              deferred.resolve(user);
            });
          } else {
            //check in the roles when it is available
            console.log("checkIsRootP():");
            let isRoot = Roles.userIsInRole(user._id, ['root'], Roles.GLOBAL_GROUP);
            if(!isRoot){
              deferred.reject('AUTH_REQUIRED');
              console.log('AUTH_REQUIRED');
              return;
            } 
            deferred.resolve(user);
          }
        }, 
        (error) => {
          deferred.reject('AUTH_REQUIRED');
        }
      );
      //promise to the used in resolved or other methods to check whether user
      //is root
      return deferred.promise;
    }
    var checkIsLoggedInP = () => {
      return $auth.awaitUser();
    }
    var checkIsLoggedIn = () => {
      return !!Meteor.userId();
    };
    /* Factory object used throughtout the code is returned here
     * as a object with various functons */
    return {
      checkIsRoot: checkIsRoot,
      checkIsRootP: checkIsRootP,
      checkIsLoggedInP: checkIsLoggedInP,
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
        vm.hasEmail = hasEmail
        vm.hasName = hasName
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

