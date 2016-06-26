import angular from 'angular';
import { Parroquias } from '../../../api/parroquias/collection';
import { Images } from '../../../api/images/collection';
import './parroquia.html';

console.log('Loaded parroquia directive!');
angular.module('parroquias').directive('parroquia', function($stateParams) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      id: '='
    },
    templateUrl: 'imports/ui/components/parroquia/parroquia.html',
    controllerAs: 'pc',
    controller: function($scope, $reactive) {
      "ngInject";
      var pc;
      $reactive(this).attach($scope);
      pc = this;
      pc.id = $scope.id;
      pc.helpers({
        parroquia: function() {
          return Parroquias.findOne({});
        }
      });
      pc.subscribe('parroquia', function() {
        return [pc.id];
      });
      return console.log('parroquia loaded');
    }
  };
});
