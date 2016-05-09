import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';

export const name = 'misas.services';

console.log("initializing misas.services module");

export default angular.module(
  name,
  [
    angularMeteor,
    angularMeteorAuth
  ]  
);
