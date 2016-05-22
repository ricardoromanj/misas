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
    if(document.services != null){
      delete document.services;
    }
    if(document.roles != null){
      delete document.roles;
    }
  }
  callback(document);
};

const sampleWatcher = {
  collectionName: 'users',
  index: 'misas',
  type: 'users',
  transformFunction: transformFunction,
  //transformFunction: null,
  fetchExistingDocuments: true,
  priority: 0
};

const watcherArray = [];
watcherArray.push(sampleWatcher);

const batchCount = 20;

function syncInit(){
  ESMongoSync.init(null, null, finalCallback, watcherArray, batchCount);
};

ElasticSearch.instance.addType({
  name: 'users',
  mapping: {
    dynamic: false,
    properties: {
      createdAt: {
        type: "date"
      },
      username: {
        type: "string"
      },
      emails: {
        properties: {
          address: { type: "string" },
          verified: { type: "boolean" }
        }
      },
      profile: {
        properties: {
          name: { type: "string" }
        }
      }
    }
  },
  sync_init: syncInit
});

