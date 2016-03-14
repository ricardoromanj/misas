console.log 'Loaded parroquias directive!'

angular.module('parroquias').directive 'parroquiasSearch', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/parroquias/views/parroquias.create.html'
    controllerAs: 'pscc'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      pscc = @
      #helpers for variables used in templates
      pscc.helpers({
          parroquias: () ->
            return Parroquias.find({})
        }
      )
  }


