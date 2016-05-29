import { Meteor } from 'meteor/meteor';
import { getEnvVarWithPrefixTwo } from '../../startup/env/utils';

Meteor.methods({
  /**
   * returns client keys for the google maps api based on env vars
   */
  'services.google.maps': () => {
    let prefix = null;
    return {
      key: getEnvVarWithPrefixTwo('SERVICE_GOOGLE_MAPS_KEY'),
      version: getEnvVarWithPrefixTwo('SERVICE_GOOGLE_MAPS_VERSION')
    }
  }
})
