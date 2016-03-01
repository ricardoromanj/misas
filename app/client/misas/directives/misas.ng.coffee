console.log 'Loaded misas directive!'

angular.module('misas').directive 'misas', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/misas/views/misas.html'
    controllerAs: 'misas'
    controller: ($scope)->
      console.log 'misas loaded'
  }

