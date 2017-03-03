import angular from 'angular';
import angularMeteor from 'angular-meteor';

export const name = 'auth';

export default angular.module(
  name,
  [
    angular,
    angularMeteor    
  ]
);
