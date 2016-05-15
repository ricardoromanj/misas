import { Meteor } from 'meteor/meteor';
import { checkIsRoot } from './utils';

Meteor.publish('misas.admin.users', function() {
  //check current user is root
  if(!checkIsRoot()){
    this.stop();
    return;
  }    
  //use elasticsearch to find ids of the given user based upon the input
  //query
  //get the users from the db based on the query
});
