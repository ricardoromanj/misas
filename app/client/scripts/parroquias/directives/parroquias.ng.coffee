console.log 'Loaded parroquias directive!'

angular.module('parroquias').directive 'parroquias', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/scripts/parroquias/views/parroquias.html'
    controllerAs: 'psc'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      @.subscribe('parroquias')
      @.helpers({
          parroquias: () ->
            return Parroquias.find({})
        }
      )
      console.log 'parroquias loaded'
  }
