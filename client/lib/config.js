import 'angular-ui-bootstrap';
import utilsPagination from 'angular-utils-pagination';

console.log('Loaded parroquias!');
angular.module('parroquias', 
  [
    'angular-meteor', 
    'ui.router', 
    'ui.bootstrap',
    utilsPagination
  ]
);
