_ = lodash

angular.module('parroquias').directive 'dhmParse', ()->
  return {
    restrict: 'E'
    scope: {
    }
    templateUrl: 'app/client/admin/WebScraping/DHM/views/DHM-parse.html'
    controllerAs: 'adhmp'
    controller: ($scope, $reactive, $q)->
      adhmp = @
      $reactive(adhmp).attach($scope)
      adhmp.states = []
      adhmp.cities = []
      adhmp.updated = 0
      adhmp.parroquias = []
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
      adhmp.getParroquias = ()->
        defered = $q.defer()
        adhmp.updated = 0
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
                state_id: stateId
                city_id: cityId
              }
              #console.log(parroquia)
              parroquia
            defered.resolve(adhmp.parroquias)
            return
        )
        return defered.promise
      #get more information for the given parroquia
      adhmp.getMoreParroquiaInfo = (parroquia, defered)->
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
            if parroquiaHtml? and parroquiaHtml.length >= 1
              #process html   
              #get photograph location or photo itself
              pictureHtml = parroquiaHtml.find("span.titulo2 > center > img")
              if pictureHtml? and pictureHtml.length > 0
                src = pictureHtml.attr("src")
                if src?
                  doesNotExistRegexp = /nodisponible\.jpg/g
                  doesNotExist = doesNotExistRegexp.exec(src)
                  if not doesNotExist?
                    parroquia.img = {
                      url: src
                    }
              #get name of diocesis if available
              datosGeneralesHtml = parroquiaHtml.find("strong:contains('Datos generales')").closest("tr").next()
              if datosGeneralesHtml? and datosGeneralesHtml.length > 0
                #address
                addressHtml = datosGeneralesHtml.find("strong:contains('Dirección')").closest("td").next()
                if addressHtml? and addressHtml.length > 0
                  addressText = addressHtml.contents().filter(()->
                    return this.nodeType == 3
                  )
                  #get street line 1
                  if addressText? and addressText.length >= 1
                    parroquia.address_line_1 = addressText[0].textContent
                  #get street line 2
                  addressLine2 = addressHtml.find("font:contains(Colonia)")
                  if addressLine2? and addressLine2.length > 0 
                    parroquia.address_line_2 = addressLine2.next().text()
                  if addressText? and addressText.length >= 3
                    stACtRegexp = /(.*),(.*)/g
                    stACt = stACtRegexp.exec(addressText[2].textContent)
                    #get city
                    if stACt?
                      if stACt.length >= 2
                        parroquia.city = _.trim(stACt[1])
                      #get state
                      if stACt.length >= 3
                        parroquia.state = _.trim(stACt[2])
                getInfo = (field, parroquiaField, parroquia) ->
                  elem = datosGeneralesHtml.find("b:contains('#{field}')")
                  if not elem? or elem.length == 0
                    return
                  elem = elem.closest("font")
                  if not elem? or elem.length == 0
                    return
                  elem = elem.next()
                  if not elem? or elem.length == 0
                    return
                  parroquia["#{parroquiaField}"] = elem.text()
                getInfo("C.P.", "postal_code", parroquia)
                getInfo("A.P.", "postal_code_a", parroquia)
                getInfo("Teléfono", "phone", parroquia)
                getInfo("Mail", "email", parroquia)
                getInfo("Website", "website", parroquia)
              day_ids = {
                lunes: 1
                martes: 2
                miercoles: 3
                jueves: 4
                viernes: 5
                sabado: 6
                domingo: 7
              }
              #gets the rest of the information
              serviciosHtml = parroquiaHtml.find("strong:contains(Servicios)").closest("tr").next()
              if serviciosHtml.length > 0
                parroquia.servicios = serviciosHtml.html()
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
                      timeRegexp = /(\d{1,2}):(\d{2})\s*([AP].M.)/gi
                      eventInfo = eventRegexp.exec(eventHtml.text())
                      #get event/mass name type 
                      if eventInfo?
                        if eventInfo.length >= 2
                          eventTypeName = eventInfo[1]
                        #get event/mass time 
                        if eventInfo.length >= 3
                          #workout the time of mass
                          eventTime = eventInfo[2]
                          #if everything matched then store it as a date
                          timeParts = timeRegexp.exec(eventTime)
                          if timeParts.length >= 4
                            hour = timeParts[1]
                            mins = timeParts[2]
                            meridiem = timeParts[3].replace(/\./g, '')
                            eventTime = {
                              hour: hour
                              mins: mins
                              meridiem: meridiem
                            }
                      {
                        type: eventTypeName
                        start_time: eventTime
                      }
                    )
                    #processes each entry
                    #console.log scheduleHtml
                  #transform day
                  tDay = _.lowerCase(_.deburr(day))
                  if day_ids[tDay]?
                    day_id = day_ids[tDay]
                  #get day id
                  {
                    id: day_id
                    name: day
                    events: daySchedule
                  }
                )
                parroquia.schedule = {
                  days: days
                }
            adhmp.updated += 1
            if defered?
              defered.resolve(parroquia)
        )
      adhmp.getAllParroquiasMoreInfo = ()->
        #update and get all information for each
        #church
        adhmp.updated = 0
        defered = $q.defer()
        #this function will return a defered promise that
        #will resolve or reject after all of the parroquias
        #have been updated
        waitAllMoreParroquiasInfo = (parroquias)->
          moreParroquiasInfo(parroquias).then(
            (updatedParroquias)->
              defered.resolve(updatedParroquias)
            (error)->
              reject.reject("getAllParroquiasMoreInfo -> waitAllMoreParroquiasInfo Error #{error}")
          )
        moreParroquiasInfo = (parroquias)->
          #get more information for all parroquias
          defers = (for i in [0..(parroquias.length)]
            $q.defer()
          )
          promises = (for defer in defers
            defer.promise
          )
          allDefered = $q.all(promises)
          #zip parroquias with their corresponding
          #promises
          requests = _.zip(defers, parroquias)
          _.forEach(requests, (request)->
            defer = request[0]
            parroquia = request[1]
            adhmp.getMoreParroquiaInfo(parroquia, defer)
          )
          #return promise to all parroquias
          return allDefered
        if not adhmp.parroquias? or adhmp.parroquias.length == 0
          #get all parroquias for current state and city
          #configuration
          adhmp.getParroquias().then(
            waitAllMoreParroquiasInfo
            (error)->
              console.log "getAllParroquiasMoreInfo: Error - #{error}"
              defered.reject(error)
          )
        else
          #just update all parroquias with more info
          waitAllMoreParroquiasInfo(adhmp.parroquias)
        return defered.promise
      adhmp.updateAllParroquias = ()->
        defered = $q.defer()
        adhmp.getAllParroquiasMoreInfo().then(
          (parroquias)->
            #save this information in mongo db
            adhmp.inserted = 0
            #make promises for each parroquia so that we
            #can wait for all of them to be done
            defers = (for i in [0..(adhmp.parroquias.length)]
              $q.defer()
            )
            promises = (for defer in defers
              defer.promise
            )
            allDefered = $q.all(promises)
            requests = _.zip(defers, adhmp.parroquias)
            #upsert each parroquia with newly updated 
            #information
            _.forEach(requests, (request)->
              defer = request[0]
              parroquia = _.clone(request[1])
              delete parroquia["$$hashKey"]
              adhmp.call(
                'parroquias.parse-upsert'
                parroquia
                (error, result)->
                  if not error?
                    console.log "inserted #{parroquia.name}"
                    adhmp.inserted += 1
                    defer.resolve(parroquia)
                  else
                    console.log "error inserting #{parroquia.name}"
                    console.log result
                    defer.reject("Error: #{parroquia.name}")
              )
            )
            #resolve the main promise after all parroquias have
            #been upserted (defered)
            allDefered.then(
              ()->
                defered.resolve(adhmp.parroquias)
              (error)->
                defered.reject("updateAllParroquias (1) : Error #{error}")
            )
          (error)->
            #if there is an error when getting more info for all
            #parroquias then reject the main promise defered
            defered.reject("updateAllParroquias (2) : Error #{error}")
        )
        return defered.promise
      return
  }
