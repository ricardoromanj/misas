import '../imports/api/parroquias/methods';
import '../imports/api/parroquias/publications';
import '../imports/api/admin/sources/DHM/methods';
import '../imports/startup/fixtures/users';
import '../imports/startup/elasticsearch/users-sync';

import { setupService } from '../imports/startup/env/login-services';

//setup LOGIN services
setupService('facebook');
setupService('google');
setupService('twitter');
