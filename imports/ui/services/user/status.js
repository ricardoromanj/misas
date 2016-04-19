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
  () => {
    return {
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
