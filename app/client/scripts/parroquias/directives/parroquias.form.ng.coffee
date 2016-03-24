angular.module('parroquias').directive 'parroquiasForm', ()->
  return {
    restrict: 'E'
    scope:
      mini: "=formtype"
    templateUrl: 'app/client/scripts/parroquias/views/parroquias.form.html'
    controllerAs: 'parroquia'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      parroquia = @
      console.log($scope)

  }
