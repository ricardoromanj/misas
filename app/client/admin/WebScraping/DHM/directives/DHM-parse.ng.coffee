angular.module('parroquias').directive 'dhmParse', ()->
  return {
    restrict: 'E'
    scope: {
    }
    templateUrl: 'app/client/admin/WebScraping/DHM/views/DHM-parse.html'
    controllerAs: 'adhmp'
    controller: ($scope, $reactive)->
      $reactive(@).attach($scope)
      adhmp = @
      adhmp.states = []
      adhmp.call('DHM-parse-all-states', (err, html)->
        #get all states and their values from website
        #use jquery to retrieve from content string
        if not error?
          stateOptions = $(html).find('option')
          #generate array of state options
          adhmp.states = for stateOpt in stateOptions
            stateName = stateOpt.innerText.trim()
            stateId = stateOpt.value.trim()
            if stateId == "-1"
              stateName = "Todos"
            {
              id: stateId
              name: stateName
            }
        return undefined
      )
      #what the current state value and based on that make
      #a request for the cities in that state
      $scope.$watch("adhmp.state", (oldValue, newValue)->
        if newValue?
          stateId = newValue.id
          adhmp.call('DHM-parse-all-cities', stateId, (err, html)->
            cityOptions = $(html).find('option')
            if not err?
              adhmp.cities = for cityOpt in cityOptions
                cityName = cityOpt.innerText.trim()
                cityId = cityOpt.value.trim()
                if cityId == "-1"
                  cityName = "Todas"
                {
                  id: cityId
                  name: cityName
                }
            return undefined
          )
      )
      return undefined
  }
