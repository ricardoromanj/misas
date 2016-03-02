console.log 'Loaded misa directive!'

angular.module('misas').directive 'misa', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/misa/views/misa.html'
    controllerAs: 'misa'
    controller: ($scope,$stateParams)->
      console.log 'misa loaded'
      $scope.id = $stateParams.id
  }

