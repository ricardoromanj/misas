import { Meteor } from 'meteor/meteor';
import { Parroquias } from './collection';
import ElasticSearch from '../../startup/elasticsearch/setup';
import pj from 'printable-json';
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
  'parroquias.search.suggest': (query) => {
    if(query === ""){
      return { options: [] };
    }
    let body = {
      search_suggestion: {
        text: query,
        phrase: {
          field: "name",
          analyzer: "misas_text_analyzer",
          max_errors: 2,
          size: 5, 
          direct_generator: [ 
            {
              suggest_mode: "popular",
              field: "name"
            }
          ]
        }
      }
    }
    let result = null;
    try {
      result = ElasticSearch.instance.suggest(
        body
      );
    } catch (e) {
      console.log(pj.toString(result));
      throw new Meteor.Error('suggestion-error', 'error while suggesting phrase completion');
    }
    return result.search_suggestion[0];
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
            fields: ["name", "diocesis_name"]
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
