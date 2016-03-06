console.log 'Loaded parroquias directive!'

angular.module('parroquias').directive 'parroquiasSearch', ()->
  return {
    restrict: 'E'
    templateUrl: 'app/client/parroquias/views/parroquias.search.html'
    controllerAs: 'pssc'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      pssc = @
      #helpers for variables used in templates
      pssc.helpers({
          parroquias: () ->
            return Parroquias.find({})
        }
      )
      #subscriptions to get data
      pssc.subscribe(
        'parroquias.search'
        ()->
          [
            {}
            pssc.getReactively('searchText')
          ]
      )
      console.log 'parroquias search loaded'
  }


