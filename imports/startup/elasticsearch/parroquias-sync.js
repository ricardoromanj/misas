import { ESMongoSync } from 'meteor/toystars:elasticsearch-sync';
import ElasticSearch from './setup';
import _ from 'lodash';


const finalCallback = () => {
  return;
};

const transformFunction = (watcher, document, callback) => {
  if(document != null){
    document.id = document._id;
    delete document._id;
    if(!_.isNil(document.img)){
      delete document.img;
    }
    if(!_.isNil(document.schedule)){
      delete document.schedule;
    }
  }
  callback(document);
};

const sampleWatcher = {
  collectionName: 'parroquias',
  index: 'misas',
  type: 'parroquias',
  transformFunction: transformFunction,
  //transformFunction: null,
  fetchExistingDocuments: true,
  priority: 0
};

const watcherArray = [];
watcherArray.push(sampleWatcher);

const batchCount = 10;

function syncInit(){
  ESMongoSync.init(null, null, finalCallback, watcherArray, batchCount);
};

ElasticSearch.instance.addType({
  name: 'parroquias',
  mapping: {
    dynamic: false,
    properties: {
      city: {
        properties: {
          name: {
            type: "string"
          },
          id: {
            type: "integer"
          } 
        }
      },
      state: {
        properties: {
          name: {
            type: "string"
          },
          id: {
            type: "integer"
          } 
        }
      },
      name: {
        type: "string"
      },
      diocesis_name: {
        type: "string"
      },
      parroquia_type: { 
        type: "string"
      },
      address: {
        type: "string"
      },
      address_line_1: {
        type: "string"
      },
      address_line_2: {
        type: "string"
      },
      postal_code: {
        type: "string"
      },
      postal_code_a: {
        type: "string"
      },
      location: {
        type: "geo_point"
      }
    }
  },
  sync_init: syncInit
});

