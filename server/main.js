import '../imports/api/parroquias/methods';
import '../imports/api/parroquias/publications';
import '../imports/api/admin/sources/DHM/methods';
import '../imports/api/users/methods';
import '../imports/startup/fixtures/users';
import ElasticSearch from '../imports/startup/elasticsearch/setup';
import { setupService } from '../imports/startup/env/login-services';

//setup LOGIN services
setupService('facebook');
setupService('google');
setupService('twitter');
//setup instance of elastic search
const elastic = ElasticSearch.instance;
console.log(elastic.search('users', {
  query: {
    match: {
      _all: 'victor'
    }
  }
}, false)); 
