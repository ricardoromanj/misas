import ElasticSearch from './setup';
import _ from 'lodash';



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

const watcher = {
  collectionName: 'users',
  index: 'misas',
  type: 'users',
  transformFunction: transformFunction,
  fetchExistingDocuments: true,
  priority: 0
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
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      emails: {
        properties: {
          address: { type: "string" },
          verified: { type: "boolean" }
        }
      },
      profile: {
        properties: {
          name: { 
						type: "string",
						analyzer: "misas_text_analyzer"
					}
        }
      }
    }
  },
	watcher: watcher
});

