import usersInit from './users-sync'
import _ from 'lodash';

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
      this._syncs_started = false;
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
      let muExists = checkEnvVarExists('MONGO_URL');
      let smuExists = checkEnvVarExists('SEARCH_MONGO_URL');
      let seuExists = checkEnvVarExists('SEARCH_ELASTIC_URL');
      if(!smuExists){
        if(!muExists){
          return false;
        }
        //setup SEARCH_MONGO_URL based on MONGO URL
        //TODO: check url syntax is correct
        process.env['SEARCH_MONGO_URL'] = getEnvVar('MONGO_URL');
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
      _.forEach(this._syncs, (collectionName, syncProperties) => {
        //check collection is available in Meteor
        let init = syncProperties["init"];
        console.log(`ElasticSearch.setupSyncs(): initializing \
                    ${collectionName}`);
        init();
      });
    }
    /**
     * Sets up both the client and sync watchers for Elastic Search. Probably
     * in the future it would also be nice if mappings for those collection
     * were also setup there. This would eliminate having that be setup outside
     * of Meteor.
     */
    setup(){
      /**
       * TODO: how would we check if the correct mappings are already in elastic
       * search or whether they need to be changed? This could be done with json
       * diff on the current mapping and the mapping in the code. If they are
       * the same then you know :P
       */
      return;
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
