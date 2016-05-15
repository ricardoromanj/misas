import { ESMongoSync } from 'meteor/toystars:elasticsearch-sync';

export default function init(){
  ESMongoSync.init(null, null, finalCallback, watcherArray, batchCount);
}

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

const batchCount = 1;

