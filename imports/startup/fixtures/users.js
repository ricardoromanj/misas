import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

const users = [ 
  {
    username: 'victor-fdez',
    email: 'victor.j.fdez@gmail.com',
    password: 'test1234',
    profile: {
      name: 'Victor Fernandez'
    }
  },
  {
    username: 'roman0316',
    email: 'rrmn92@gmail.com',
    password: 'test1234',
    profile: {
      name: 'Ricardo Roman'
    }
  }
]

if(Meteor.isServer){
  if(Meteor.users.find().count() == 0){
    for(let user of users){
      var result = Accounts.createUser(user);
      console.log(result);
      if(result != null){
        Roles.addUsersToRoles(result, 'root', Roles.GLOBAL_GROUP);
      }
    }
  }
}
