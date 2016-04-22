import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import 'angular-meteor';
 
export const name = 'misas.users';

export default angular.module(
  'misas.users',
  [
    'angular-meteor'
  ]  
).factory(
  'user',
  ($q) => {
    "ngInject";
    return {
      checkLoggedIn(){
        var deferred = $q.deferred()
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
        vm.helpers({
          currentUser() {
            return Meteor.user(); 
          },
          currentUserId() {
            return Meteor.userId();
          },
          isLoggedIn() {
            return !!Meteor.userId();
          }
        });
      }
    }
  }
);
