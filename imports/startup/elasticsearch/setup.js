import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
//import usersInit from './users-sync'
import { ESMongoSync } from 'meteor/toystars:elasticsearch-sync';
import _ from 'lodash';
import pj from 'printable-json';
import elasticsearch from 'elasticsearch';

let singleton = Symbol();
let singletonEnforcer = Symbol();

export default class ElasticSearch {
  /**
   * Initialize variables that will be used by the singleton. _syncs is a 
   * map of collection names to others maps that contain properties like init
   * for initializing the elasticsearch collection syncers for that collection
   * .
   *
   * @param enforcer
   */
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
        throw "Cannot construct singleton"
    }
    this._types = []
    this._index = 'misas';
    this._syncs_started = false;
    this._setup_done = false;
		this.batchCount = 200;
  }
  /**
   * Check if MONGO_URL, if does then check if SEARCH_MONGO_URL exists, if it
   * does then do nothing, else if doesn't exist then set SEARCH_MONGO_URL to
   * the value of MONGO_URL.
   *
   * This method mainly check the following env variables exists and are set
   * correctly. 
   *
   *   SEARCH_MONGO_URL='mongodb://{host:port}'
   *   SEARCH_ELASTIC_URL='{host:port}'
   *
   */
  checkEnv(){
    let muExists = this.checkEnvVarExists('MONGO_URL');
    let smuExists = this.checkEnvVarExists('SEARCH_MONGO_URL');
    let seuExists = this.checkEnvVarExists('SEARCH_ELASTIC_URL');
    if(!smuExists){
      if(!muExists){
        console.log('ElasticSearch.checkEnv(): MONGO_URL must atleast be \
                    defined');
        return false;
      }
      //setup SEARCH_MONGO_URL based on MONGO URL
      //TODO: check url syntax is correct
      process.env['SEARCH_MONGO_URL'] = this.getEnvVar('MONGO_URL');
    }
    if(!seuExists){
      return false;
    }
    //everythings is good to start syncing and searching
    return true;
  } 
  /**
   * Checks that the enviroment variable exists, and returns true or false
   *
   * @returns Boolean
   */
  checkEnvVarExists(name){
    return !_.isNil(name) && !_.isNil(process.env[name]) && _.isString(name);
  }
  /**
   * Gets enviroment variable value
   *
   * @returns String
   */
  getEnvVar(name){
    if(_.isNil(name)){
      throw `ElasticSearch.getEnvVar() needs a ${name}`;
    }
    return process.env[name];
  }
  /**
   * Sets up the syncs by checking the environment and the initializing the
   * watchers for each collection so that Elastic Search syncs are done 
   * accordingly.
   *
   */
  setupSyncs(){
		let watchers = [];
    for(let type of this._types){
      if(_.isNil(type.watcher)){
        console.log(`ElasticSearch.setupSyncs(): ${name} uninitialized`);
        continue;
      }
      let name = type.name;
      console.log(
`ElasticSearch.setupSyncs(): initializing ${name}`
      );
			watchers.push(type.watcher);
    }
		//startup es mongo syncs
		ESMongoSync.init(null, null, 
			this.finishedInitSyncs, 
			watchers, 
			this.batchCount);
    this._syncs_started = true;
    return true;
  }
  /**
   * Connects to elastic search and sets up mappings and other stuff to 
   * analyze documents for indexing.
   *
   */
  setupElasticSearch(){
    let elasticUrl = this.getEnvVar('SEARCH_ELASTIC_URL')
    /**
     * we can't setup elasticsearch without a url 
     */
    if(_.isNil(elasticUrl)){
      return false;
    }
    this.client = new elasticsearch.Client(
      {
        host: elasticUrl,
        log: 'error'
      }
    );
    console.log('ElasticSearch.setupElasticSearch: client setup\'d');
    //TODO:ping elastic search to check it is up and running and can receive 
    let ping = Meteor.wrapAsync(this.client.ping, this.client);
    try {
      let result = ping({
        requestTimeout: 10000  
      });
      if(result){
        console.log('ElasticSearch.setupElasticSearch: ping\'d');
      }
    } catch (e) {
      console.log(`ElasticSearch.setupElasticSearch: failed to ping\'d @ \
                  ${elasticUrl}`);
      return false;
    }
    return true;
  }
  /**
   * Sets up the misas index if not already available
   */
  setupElasticSearchIndex(){
    //check if misas index exists
    let exists = Meteor.wrapAsync(this.client.indices.exists, this.client);
    /*try {
      if(exists({index: this._index})){
        return true;
      }
    } catch(e) {
      console.log(
'ElasticSearch.setupElasticSearchIndex(): Error trying to check if \'misas\' \
index exists'
      );
      console.log(e);
      return false;
    }
		*/
    /**
     * if it does not exist create it
     */
    let createIndex = Meteor.wrapAsync(
      this.client.indices.create, 
      this.client);
		let openIndex = Meteor.wrapAsync(this.client.indices.open, this.client);
		let closeIndex = Meteor.wrapAsync(this.client.indices.close, this.client);
    try {
      if(!exists({index: this._index})){
				createIndex({index: this._index});
      }
    } catch(e) {
      console.log(
'ElasticSearch.setupElasticSearchIndex(): Error setting up \'misas\' index'
      );
      console.log(e);
      return false;
    }
    /**
     * wait for index to get yellow status and thereby allow the setting up of
     * the index with more settings like analyzers and mappers and such.
     */
		let indexStatus = Meteor.wrapAsync(
      this.client.cluster.health, 
      this.client);
    try {
      result = indexStatus({
        waitForStatus: 'yellow',
        index: this._index
      });
      console.log('ElasticSearch.setupElasticSearchIndex(): index status');
      console.log(result);
    } catch (e) {
      console.log(
'ElasticSearch.setupElasticSearchIndex(): Error waiting for \'misas\' index \
setup'
      );
      console.log(e);
      return false;
    }
    /**
     * add analyzers to the misas index
     */
    let putSettings = Meteor.wrapAsync(
      this.client.indices.putSettings, 
      this.client);
    try {
			closeIndex({index: this._index});
      putSettings({
				index: this._index,
				body: {
					analysis: {
						analyzer: {
							misas_text_analyzer: {
								type: "custom",
								filter: ["standard", "asciifolding", "lowercase"],
								tokenizer: "standard"
							},
							misas_word_edges_analyzer: {
								type: "custom",
								filter: ["standard", "asciifolding", "lowercase"],
								tokenizer: "misas_edge_ngram_tokenizer"
							}
						},
						tokenizer: {
							misas_edge_ngram_tokenizer: {
								type: "edgeNGram",
								min_gram: "1",
								max_gram: "5",
								token_chars: ["letter", "digit"]
							}
						}
					}
				}
      });
			openIndex({index: this._index});
    } catch(e) {
      console.log(
'ElasticSearch.setupElasticSearchIndex(): Error settings for \'misas\''
      );
			console.log(e);
    }
    return true;
  }
  /**
   * Adds a type and all of it's setup methods.
   */
  addType(type){
    if(_.isNil(type.name)){
      throw `ElasticSearch.setupElasticSearchTypes(): type has nil name`;
    }
    if(_.isNil(type.mapping)){
      throw `ElasticSearch.setupElasticSearchTypes(): ${type.name} has nil\
mapping`;
    }
    if(_.isNil(type.watcher)){
      throw `ElasticSearch.setupElasticSearchTypes(): ${type.name} has nil\
watcher`;
		}
    //TODO: check if type is already in array
    this._types.push(type);
  }
  /**
   * Checks if the types exists in the index. If it does return true else 
   * return false. 
   */
  checkTypeExists(type){
    if(_.isNil(type)){
      throw 'ElasticSearch.checkTypeExists(): type should not be null';
    }
    let exists = Meteor.wrapAsync(this.client.indices.existsType, this.client);
    try {
      return exists({index: this._index, type: type});
    } catch(e){
      console.log(
`ElasticSearch.checkTypeExists(): Error checking \'${this._index}\'.\'${type}\
\' exists`
      );
      console.log(e);
    }
    return false;
  }
  /**
   * For each of the added types check if they exists, else add that new types.
   * When adding the new type the mapping for that type will always be added so
   * if there is an old mapping in elastic search that will always be reaplaced
   */
  setupElasticSearchTypes(){
    //for each sync setup it's type if it does not exist
    putMapping = Meteor.wrapAsync(this.client.indices.putMapping, this.client);
    for (let type of this._types){
      //TODO: put all the mappings everytime for now... in the future this will 
      //change
      let name = type.name;
      let mapping = type.mapping;
      try {
        let result = putMapping(
          {
            index: this._index,
            type: name,
            body: mapping 
          }
        );
        console.log(
`ElasticSearch.setupElasticSearchTypes(): Adding mapping for \'${name}\'`
        );
        console.log(result);
      } catch(e) {
        console.log(
`ElasticSearch.setupElasticSearchTypes(): Failed to add mapping for \'${name}\
\'`
        );
        console.log(e);
        //stop adding new types since this type failed
        return false;
      }
      //continue on to the next type
    }
    return true;
  }
  /**
   * Sets up both the client and sync watchers for Elastic Search. Probably
   * in the future it would also be nice if mappings for those collection
   * were also setup there. This would eliminate having that be setup outside
   * of Meteor.
   */
  setup(){
    // already did the setup so don't do it anymore
    if(this._setup_done){
      return true;
    }
    if(!this.checkEnv()){
      return false;
    }
    /**
     * setup elastic search client
     */
    if(!this.setupElasticSearch()){
      return false;
    }
    /**
     * setup indices, types, analyzers, and maps
     */
console.log(`ElasticSearch.setup(): initialize index`);
    if(!this.setupElasticSearchIndex()){
      return false;
    }
console.log(`ElasticSearch.setup(): initialize index types`);
    if(!this.setupElasticSearchTypes()){
      return false;
    }
console.log(`ElasticSearch.setup(): initialize syncs`);
    if(!this.setupSyncs()){
      return false;
    }
    /**
     * if this point is reached then everything was setup correctly.
     */
    this._setup_done = true;
    return true;
  }
	finishedInitSyncs(){
console.log(`ElasticSearch: finished initial syncs`);
		return true;
	}
  suggest(body = {}){
    /**
     * check setup before searching elastic
     */
    if(!this.setup()){
      return null;
    }
    let suggest = Meteor.wrapAsync(this.client.suggest, this.client);
    let result = suggest({
      index: this._index,
      body: body
    });
    //console.log(pj.toString(result.search_suggestion[0]));
    return result;
  }
  /**
   * Pass in the type which is the name of the collection all lower cases name
   * the body is the query that will be sent to elasticsearch. As for the
   * results, they will be transformed into a mongodb query that can be directly
   * passed as mongos db cursor.
   */
  search(type = '', body = {}, onlyIds = true, page = null, options = {}){
    /**
     * check setup before searching elastic
     */
    if(!this.setup()){
      return null;
    }
		let from = 0;
		let size = 0; 
		if(!_.isNil(page) && !_.isNil(page.page) && !_.isNil(page.perPage)){
			from = (page.page*page.perPage);
			size = page.perPage;	
		}
		let queryPage = {
			from: from,
			size: size
		};
		//merge page information into the body of the search
		_.merge(body, queryPage);
    //merge options into body
    _.merge(body, options);
    let search = Meteor.wrapAsync(this.client.search, this.client);
    let query = {
      index: this._index,
      type: type,
      body: body
    };
    let result = search(query); 
    // if no result came back then return nil else return a mongo cursor with
    // the documents in it.
    if(_.isNil(result)){
      return null;
    }
    // get mongo cursor here
    let hits = result.hits.hits;
    let time = result.took;
    let total = result.hits.total;
    let results = {};
    let properties = ['_id', '_score', 'highlight'];
    if(!onlyIds){
      properties.push('_source');
    }
    //console.log(pj.toString(result));
    /*_.forEach(hits, (hit) => {
      console.log(pj.toString(hit))
    });*/
    results.hits = _.map(hits, (hit) => {
      let obj = _.pick(hit, properties);
      if(!_.isNil(obj._source)){
        let source = obj._source;
        _.unset(obj, '_source');
        _.unset(source, 'id');
        _.unset(source, '_id');
        _.merge(obj, source);
      }
      return obj;
    });
		results.total = result.hits.total; 
    return results;
  }
  /**
   * This method initalizes everything after all information for all types has
   * been setup
   */
  init(){
    this.setup();
  }
  /**
   * Use this method go the the single instance of ElasticSearch that will
   * be used throughout the application to to make queries to ElasticSearch
   *
   * @returns Singleton
   */
  static get instance() {
    if (!this[singleton]) {
        this[singleton] = new ElasticSearch(singletonEnforcer);
    }
    return this[singleton];
  }
}

