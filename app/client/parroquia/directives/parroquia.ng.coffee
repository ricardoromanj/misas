console.log 'Loaded parroquia directive!'

angular.module('parroquias').directive 'parroquia', ($stateParams)->
  return {
    restrict: 'E'
    scope: {
      id: '='
    }
    templateUrl: 'app/client/parroquia/views/parroquia.html'
    controllerAs: 'pc'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      #assign to the controller (this) the variables to be
      #accessed thru pc in the template
      pc = @
      pc.id = $scope.id
      pc.helpers(
        parroquia: ()->
          return Parroquias.findOne({ _id: pc.id}) 
      )
      console.log 'parroquia loaded'
  }

