import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { checkIsRoot } from './utils';
import ElasticSearch from '../../startup/elasticsearch/setup';

Meteor.methods({
  // this method is used to check whether the current logged in user has
  // root priviledges
  'misas.users.checkIsRoot': function(){
    return checkIsRoot();
  },
  /**
   * Searches for users based on the input parameters
   */
  'admin.users.search': function(query = {}, page = {}){
    console.log('admin.users.search');
    console.log(query);
    console.log(page);
    if(!checkIsRoot()){
      return [];
    }    
    let results = ElasticSearch.instance.search(
      'users',
      query,
      false,
      page  
    );
    return results;
  }
});

