import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { checkIsRoot } from './utils';

Meteor.methods({
  // this method is used to check whether the current logged in user has
  // root priviledges
  'misas.users.checkIsRoot': function(){
    return checkIsRoot();
  }
});

