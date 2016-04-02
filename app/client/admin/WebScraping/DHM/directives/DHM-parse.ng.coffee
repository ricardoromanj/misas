angular.module('parroquias').directive 'dhmParse', ()->
  return {
    restrict: 'E'
    scope: {
    }
    templateUrl: 'app/client/admin/WebScraping/DHM/views/DHM-parse.html'
    controllerAs: 'adhmp'
    controller: ($scope, $reactive)->
      adhmp = @
      $reactive(adhmp).attach($scope)
      adhmp.states = []
      adhmp.cities = []
      adhmp.call('DHM-parse-all-states', (err, html)->
        #get all states and their values from website
        #use jquery to retrieve from content string
        if not error?
          stateOptions = $(html).find('option')
          #generate array of state options
          adhmp.states = for stateOpt in stateOptions
            stateName = stateOpt.innerHTML.trim()
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
      $scope.$watch("adhmp.state", (newValue, oldValue)->
        if newValue?
          stateId = newValue.id
          adhmp.call('DHM-parse-all-cities', stateId, (err, html)->
            cityOptions = $(html).find('option')
            if not err?
              adhmp.cities = for cityOpt in cityOptions
                cityName = cityOpt.innerHTML.trim()
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
      adhmp.parroquias = []
      adhmp.getParroquias = ()->
        if adhmp.city?
          cityId = adhmp.city.id
        if adhmp.state?
          stateId = adhmp.state.id
        adhmp.call(
          'DHM-parse-parroquias'
          {
            cityId: cityId
            stateId: stateId
          }
          (err, html)->
            #get each row of parroquias returned 
            firstTable = $(html).get(0)
            if not firstTable?
              return
            parroquiasTrs = $(firstTable).find(" > tbody > tr")
            #for each parroquias get the link to parroquia page and process parroquia row
            adhmp.parroquias = for parroquiaTr in parroquiasTrs
              parroquiaTr = $(parroquiaTr)
              parroquiaTds = parroquiaTr.find("td > table:first-child td")
              #get parroquia image
              if parroquiaTds.length > 0
                parroquiaImg = $(parroquiaTds[0]).find("img").attr("src")
              #get parroquia address 
              if parroquiaTds.length > 1
                parroquiaInfo = $(parroquiaTds[1])
                diocesisName = parroquiaInfo.find("font:first-child").text()
                parroquiaName = parroquiaInfo.find("font.nom_parroquia_amarillo > b").text()
                parroquiaRegexp = /([^:]+):(.*)/g
                names = parroquiaRegexp.exec(parroquiaName)
                if names.length == 3
                  parroquiaType = names[1]
                  parroquiaName = names[2]
                else
                  console.log("Error! please fix this: #{parroquiaName}")
                addressPre = parroquiaInfo.find("font.datoscolonia").get(1)
                address = if addressPre? then $(addressPre).text() else ""
                other = parroquiaInfo.find("font:last-child").text()
              #get church address
              #get the link href for each parroquia and interpreter href to see
              #if the client wants to get more information
              parroquiaHref = ""
              parroquiaAnchor = parroquiaTr.find("td > table:last-child a")
              if parroquiaAnchor.length > 0
                parroquiaHref = parroquiaAnchor.attr("href")
                idsRegexp = /&id=(\d+)&d=(\d+)/g
                ids = idsRegexp.exec(parroquiaHref)
                if ids.length == 3
                  parroquiaId = ids[1]
                  diocesisId = ids[2]
                else
                  console.log("Error! please fix this: #{parroquiaHref}")
                #parse href for diocesis and parroquia's id
              #should parse address for the different fields
              parroquia = {
                diocesis_name: diocesisName
                name: parroquiaName
                parroquia_type: parroquiaType
                address: address
                other: other
                href: parroquiaHref
                id: parroquiaId
                diocesis_id: diocesisId
              }
              #console.log(parroquia)
              parroquia
            return
        )
      #get more information for the given parroquia
      adhmp.getMoreParroquiaInfo = (parroquia)->
        if not parroquia? or
        not parroquia.id? or
        not parroquia.diocesis_id?
          return
        adhmp.call(
          'DHM-parse-parroquia'
          {
            id: parroquia.id
            d: parroquia.diocesis_id
          }
          (error, html)->
            parroquiaHtml = $(html)
            if parroquiaHtml.length >= 1
              #process html   
              #get photograph location or photo itself
              #get name of diocesis if available
              datosGeneralesHtml = parroquiaHtml.find("strong:contains('Datos generales')").closest("tr").next()
              if datosGeneralesHtml.length > 0
                #address
                addressHtml = datosGeneralesHtml.find("strong:contains('Dirección')").closest("td").next()
                if addressHtml.length > 0
                  addressText = addressHtml.contents().filter(()->
                    return this.nodeType == 3
                  )
                  #get street line 1
                  if addressText.length >= 1
                    parroquia.address_line_1 = addressText[0].textContent
                  #get street line 2
                  addressLine2 = addressHtml.find("font:contains(Colonia)").next().text()
                  if addressLine2 != ""
                    parroquia.address_line_2 = addressLine2
                  if addressText.length >= 3
                    stACtRegexp = /(.*),(.*)/g
                    stACt = stACtRegexp.exec(addressText[2].textContent)
                    #get city
                    if stACt.length >= 2
                      parroquia.city = lodash.trim(stACt[1])
                    #get state
                    if stACt.length >= 3
                      parroquia.state = lodash.trim(stACt[2])
                #get postal code
                cpText = datosGeneralesHtml.find("b:contains('C.P.')").closest("font").next().text()
                if cpText != ""
                  parroquia.postal_code = cpText
                #get apartado postal
                apText = datosGeneralesHtml.find("b:contains('A.P.')").closest("font").next().text()
                if apText != ""
                  parroquia.postal_code_a = apText
                #get telephone
                phoneText = datosGeneralesHtml.find("b:contains('Teléfono')").closest("font").next().text()
                if phoneText != ""
                  parroquia.phone = phoneText
                #get contact mail if available
                emailText = datosGeneralesHtml.find("b:contains('Mail')").closest("font").next().text()
                if emailText != ""
                  parroquia.email = emailText
                #get website if available
                websiteText = datosGeneralesHtml.find("b:contains('Website')").closest("font").next().text()
                if websiteText != ""
                  parroquia.website = websiteText
              #get fiesta patronal
              #get lat lon information
              #get schedule information
              scheduleHtml = parroquiaHtml.find("strong:contains(Misas)").closest("tr").next()
              if scheduleHtml.length > 0
                #get days for schedule
                daysHtml = scheduleHtml.find("b")
                daysHtml = (daysHtml.get i for i in [0..(daysHtml.length-1)])
                days = (for dayHtml in daysHtml
                  dayHtml = $(dayHtml)
                  #get day name
                  day = dayHtml.text()
                  #get each schedule
                  scheduleHtml = dayHtml.next().next()
                  if scheduleHtml.length > 0
                    daySchedule = (for eventHtml in scheduleHtml.find("font")
                      eventHtml = $(eventHtml)
                      #for each event/mass get the specific time of mass
                      #and then get the type of mass offered
                      eventRegexp = /(.*)\s-\s(.*)/g
                      timeRegexp = /.*/
                      eventInfo = eventRegexp.exec(eventHtml.text())
                      #get event/mass name type 
                      if eventInfo.length >= 2
                        eventTypeName = eventInfo[1]
                      #get event/mass time 
                      if eventInfo.length >= 3
                        #workout the time of mass
                        eventTimeText = eventInfo[2]
                      {
                        type: eventTypeName
                        start_time: eventTimeText
                      }
                    )
                    #processes each entry
                    #console.log scheduleHtml
                  {
                    name: day
                    events: daySchedule
                  }
                )
                parroquia.schedule = {
                  days: days
                }
              #console.log(html)
        )
        return
      adhmp.getAllParroquiasMoreInfo = ()->
        return
      adhmp.updateAllParroquias = ()->
        return
      return
  }
