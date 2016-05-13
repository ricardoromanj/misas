import { ESMongoSync } from 'meteor/toystars:elasticsearch-sync';

let finalCallback = () => {
  return;
};

let transformFunction = (watcher, document, callback) => {
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

let sampleWatcher = {
  collectionName: 'users',
  index: 'misas',
  type: 'users',
  transformFunction: transformFunction,
  //transformFunction: null,
  fetchExistingDocuments: true,
  priority: 0
};

let watcherArray = [];
watcherArray.push(sampleWatcher);

let batchCount = 1;

ESMongoSync.init(null, null, finalCallback, watcherArray, batchCount);
