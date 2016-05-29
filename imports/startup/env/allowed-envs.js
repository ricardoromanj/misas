import { allowEnv } from 'meteor/mrt:allow-env';

console.log('Setting up allowed enviroment variables');
console.log(allowEnv);
allowEnv({
  DEV_SERVICES_GOOGLE_MAPS_KEY: 1,
  DEV_SERVICES_GOOGLE_MAPS_VERSION: 1
});
