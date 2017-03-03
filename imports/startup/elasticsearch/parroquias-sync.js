import ElasticSearch from './setup';
import _ from 'lodash';

const transformFunction = (watcher, document, callback) => {
  if(document != null){
    document.id = document._id;
    delete document._id;
    delete document.images;
    if(!_.isNil(document.img)){
      delete document.img;
    }
    if(!_.isNil(document.schedule)){
      delete document.schedule;
    }
  }
  callback(document);
};

const watcher = {
  collectionName: 'parroquias',
  index: 'misas',
  type: 'parroquias',
  transformFunction: transformFunction,
  //transformFunction: null,
  fetchExistingDocuments: true,
  priority: 0
};

ElasticSearch.instance.addType({
  name: 'parroquias',
  mapping: {
    dynamic: false,
    properties: {
      city: {
        properties: {
          name: {
            type: "string",
						analyzer: "misas_text_analyzer"
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
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      diocesis_name: {
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      parroquia_type: { 
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      address: {
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      address_line_1: {
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      address_line_2: {
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      postal_code: {
        type: "string",
				analyzer: "misas_text_analyzer"
      },
      postal_code_a: {
        type: "string"
      },
      location: {
        type: "geo_point"
      }
    }
  },
	watcher: watcher
});

