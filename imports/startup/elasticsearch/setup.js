import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import usersInit from './users-sync'
import _ from 'lodash';
import elasticsearch from 'elasticsearch';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class ElasticSearch {
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
    this._syncs = {
      "users": {
        "init": usersInit
      }
    }
    this._index = 'misas';
    this._syncs_started = false;
    this._setup_done = false;
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
    _.forEach(this._syncs, (syncProperties, collectionName) => {
      //check collection is available in Meteor
      let init = syncProperties["init"];
      console.log(`ElasticSearch.setupSyncs(): initializing \
                  ${collectionName}`);
      init();
    });
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
    this.client = new elasticsearch.Client(
      {
        host: elasticUrl,
        log: 'trace'
      }
    );
    console.log('ElasticSearch.setupElasticSearch: client setup\'d');
    //TODO:ping elastic search to check it is up and running and can receive 
    let ping = Meteor.wrapAsync(this.client.ping, this.client);
    let result = ping({
      requestTimeout: 10000  
    });
    if(result){
      console.log('ElasticSearch.setupElasticSearch: ping\'d');
    }
    return result;
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
     * TODO: how would we check if the correct mappings are already in elastic
     * search or whether they need to be changed? This could be done with json
     * diff on the current mapping and the mapping in the code. If they are
     * the same then you know :P
     */
    if(!this.setupElasticSearch()){
      return false;
    }
    if(!this.setupSyncs()){
      return false;
    }
    this._setup_done = true;
    return true;
  }
  /**
   * Pass in the type which is the name of the collection all lower cases name
   * the body is the query that will be sent to elasticsearch. As for the
   * results, they will be transformed into a mongodb query that can be directly
   * passed as mongos db cursor.
   */
  search(type = '', body = {}, onlyIds = true, page = null){
    let search = Meteor.wrapAsync(this.client.search, this.client);
    let query = {
      index: this._index,
      type: type,
      body: body
    };
    console.log('querying');
    console.log(query);
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
    let results = [];
    let properties = ['_id', '_score'];
    if(!onlyIds){
      properties.push('_source');
    }
    results = _.map(hits, (hit) => {
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
    return results;
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
        this[singleton].setup();
    }
    return this[singleton];
  }
}



export default ElasticSearch;
