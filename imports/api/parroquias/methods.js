import { Meteor } from 'meteor/meteor';
import { Parroquias } from './collection';
import ElasticSearch from '../../startup/elasticsearch/setup';
import _ from 'lodash';

Meteor.methods({
  'parroquias.parse-upsert': function(parroquia) {
    var result;
    console.log("" + parroquia.name);
    if ((parroquia.diocesis_id == null) || 
        (parroquia.id == null) || 
        (parroquia.state == null) || 
        (parroquia.state.id == null) || 
        (parroquia.city == null) || 
        (parroquia.city.id == null)
     ) 
     {
       throw new Meteor.error("Missing Field", "Missing a field from [diocesis_id, id, state.id, city.id]");
     }
     result = Parroquias.update({
       id: parroquia.id,
       diocesis_id: parroquia.diocesis_id,
       'state.id': parroquia.state.id,
       'city.id': parroquia.city.id
     }, {
       $set: parroquia
     }, {
       upsert: true
     });
     console.log(result);
     return result;
  },
  'parroquias.insert': function(parroquia) {},
  'parroquias.search': (query, page) => {
    let body = {};
    if(_.isNil(query)){
      return {};
    }
    if(query === ""){
      body = {
        query: {
          match_all: {}
        } 
      }; 
    } else {
      body = {
        query: {
          match: {
            name: query 
          }
        }  
      };
    }
    let result = null;
    result = ElasticSearch.instance.search(
      'parroquias', 
      body,
      false,
      page 
    );
    return result;
  } 
});
