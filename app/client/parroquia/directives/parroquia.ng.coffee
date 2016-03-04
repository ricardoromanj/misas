console.log 'Loaded parroquia directive!'

angular.module('parroquias').directive 'parroquia', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/parroquia/views/parroquia.html'
    controllerAs: 'p'
    controller: ($scope, $stateParams)->
      console.log 'parroquia loaded'
      $scope.p = {}
      p = $scope.p
      p.id = $stateParams.id
  }

