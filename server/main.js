import '../imports/api/parroquias/methods';
import '../imports/api/parroquias/publications';
import '../imports/api/admin/sources/DHM/methods';
import '../imports/startup/server-startup';
import '../imports/api/users/methods';
import '../imports/api/services/google.maps';
import '../imports/startup/fixtures/users';
import '../imports/startup/elasticsearch/users-sync';
import '../imports/startup/elasticsearch/parroquias-sync';
import '../imports/startup/env/allowed-envs.js';
import ElasticSearch from '../imports/startup/elasticsearch/setup';
import { setupService } from '../imports/startup/env/login-services';
import { Meteor } from 'meteor/meteor';

//setup LOGIN services
setupService('facebook');
setupService('google');
setupService('twitter');
//setup instance of elastic search
ElasticSearch.instance.init();
console.log(Meteor.settings);
