import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

const envToPrefixMap2 = {
  'dev': 'DEV',
  'test': 'ALL',
  'prod': 'ALL'
};
/**
 * getEnvVarWithPrefixTwo
 *
 * This function returns an environment name of the following form depending on
 * the defined environment. For example if environment variable is test and we
 * have envToPrefixMap2 with test mapping to 'ALL' then this function will 
 * generate the environment varibale value of ALL_(name) were name is a string. 
 */
export function getEnvVarWithPrefixTwo(name){
  return getEnvVarWithPrefix(name, envToPrefixMap2);
};
const envToPrefixMap = {
  'dev': 'DEV',
  'test': 'TEST',
  'prod': 'PROD'
};
/**
 * getEnvVarWithPrefixAll
 *
 * This function returns an environment name of the following form depending on
 * the defined environment. For example if environment variable is test and we
 * have envToPrefixMapAll with test mapping to 'TEST' then this function will 
 * generate the environment varibale value of TEST_(name) were name is a 
 * string. 
 */
export function getEnvVarWithPrefixAll(name){
  return getEnvVarWithPrefix(name, envToPrefixMap);
};
/**
 * This function is used by the other two, by getting a different prefix map.
 */
function getEnvVarWithPrefix(name, prefixMap){
  let env = process.env['ENVIRONMENT'];
  if(_.isNil(process.env['ENVIRONMENT'])){
    throw new Meteor.Error('env-var-not-found', 
     'env \'ENVIRONMENT\' not found');
  }
  let prefix = prefixMap[env]; 
  if(_.isNil(prefix)){
    throw new Meteor.Error('env-prefix-not-found', 
     'env prefix not found');
  } 
  env = process.env[`${prefix}_${name}`];
  if(_.isNil(env)){
    throw new Meteor.Error('env-var-not-found', 
     `env \'${prefix}_${name}\' not found`);
  } 
  return env;
};
