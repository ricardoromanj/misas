import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';

export function checkIsRoot(){
  userId = Meteor.userId();
  if(userId == null || !_.isString(userId)){
    return false;
  }
  //check roles of the user contain root
  let result = Roles.userIsInRole(userId, ['root'], Roles.GLOBAL_GROUP);
  return result;
}

export function checkIsRootWithError(){
  if(checkIsRoot()){
    return;
  }
  throw new Meteor.Error('user-is-not-root', "You are not logged in as Root");
}

