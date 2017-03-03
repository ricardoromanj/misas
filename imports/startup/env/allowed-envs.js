//import { allowEnv } from 'meteor/mrt:allow-env';
import _ from 'lodash';

_.forIn(process.env, (value, key) => {
  console.log(`${key} = ${value}`);
});
/*
allowEnv({
  DEV_SERVICES_GOOGLE_MAPS_KEY: 1,
  DEV_SERVICES_GOOGLE_MAPS_VERSION: 1
});
*/
