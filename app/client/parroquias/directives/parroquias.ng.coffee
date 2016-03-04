console.log 'Loaded parroquias directive!'

angular.module('parroquias').directive 'parroquias', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/parroquias/views/parroquias.html'
    controllerAs: 'psc'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      @.helpers({
          parroquias: () ->
            return Parroquias.find()
        }
      )
      console.log 'parroquias loaded'
  }

