import _ from 'lodash';
/*
 * cnameToComponentName
 *
 * This function will changes canonical names to
 * the following format.
 *
 * animal.horse -> animalHorse
 * admin.users -> adminUsers
 */
export function cnameToComponentName(canonicalName){
  return _.camelCase(canonicalName);
}
