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
  'parroquias.suggest': (query) => {
    if(query === ""){
      return null;
    }
    let body = {
      search_suggestion: {
        analyzer: "misas_text_analyzer",
        field: "name",
        gram_size: 2
      }
    }
    let result = ElasticSearch.instance.suggest(
    );
    return result;
  },
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
          multi_match: {
            query: query,
            fields: ["name^2", "diocesis_name"]
          }
        },
        highlight: {
          pre_tags: ["<strong>"],
          post_tags: ["</strong>"],
          fields: {
            name: { force_source: true },
            diocesis_name: { force_source: true }
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
