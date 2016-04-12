import _ from 'lodash';
import url from 'url';

angular.module('parroquias').directive('dhmParse', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'app/client/admin/WebScraping/DHM/views/DHM-parse.html',
    controllerAs: 'adhmp',
    controller: function($scope, $reactive, $q) {
      var adhmp;
      adhmp = this;
      $reactive(adhmp).attach($scope);
      adhmp.states = [];
      adhmp.cities = [];
      adhmp.updated = 0;
      adhmp.parroquias = [];
      adhmp.call('DHM-parse-all-states', function(err, html) {
        var stateId, stateName, stateOpt, stateOptions;
        if (typeof error === "undefined" || error === null) {
          stateOptions = $(html).find('option');
          adhmp.states = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = stateOptions.length; j < len; j++) {
              stateOpt = stateOptions[j];
              stateName = stateOpt.innerHTML.trim();
              stateId = stateOpt.value.trim();
              if (stateId === "-1") {
                stateName = "Todos";
              }
              results.push({
                id: stateId,
                name: stateName
              });
            }
            return results;
          })();
        }
        return void 0;
      });
      $scope.$watch("adhmp.state", function(newValue, oldValue) {
        var stateId;
        if (newValue != null) {
          stateId = newValue.id;
          return adhmp.call('DHM-parse-all-cities', stateId, function(err, html) {
            var cityId, cityName, cityOpt, cityOptions;
            cityOptions = $(html).find('option');
            if (err == null) {
              adhmp.cities = (function() {
                var j, len, results;
                results = [];
                for (j = 0, len = cityOptions.length; j < len; j++) {
                  cityOpt = cityOptions[j];
                  cityName = cityOpt.innerHTML.trim();
                  cityId = cityOpt.value.trim();
                  if (cityId === "-1") {
                    cityName = "Todas";
                  }
                  results.push({
                    id: cityId,
                    name: cityName
                  });
                }
                return results;
              })();
            }
            return void 0;
          });
        }
      });
      adhmp.getParroquias = function() {
        var cityId, defered, stateId;
        console.log("adhmp.getParroquias()");
        defered = $q.defer();
        adhmp.updated = 0;
        if (adhmp.city != null) {
          cityId = adhmp.city.id;
        }
        if (adhmp.state != null) {
          stateId = adhmp.state.id;
        }
        adhmp.call('DHM-parse-parroquias', {
          cityId: cityId,
          stateId: stateId
        }, function(err, html) {
          var address, addressPre, diocesisId, diocesisName, firstTable, ids, idsRegexp, names, other, parroquia, parroquiaAnchor, parroquiaHref, parroquiaId, parroquiaImg, parroquiaInfo, parroquiaName, parroquiaRegexp, parroquiaTds, parroquiaTr, parroquiaType, parroquiasTrs;
          firstTable = $(html).get(0);
          if (firstTable == null) {
            return;
          }
          parroquiasTrs = $(firstTable).find(" > tbody > tr");
          adhmp.parroquias = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = parroquiasTrs.length; j < len; j++) {
              parroquiaTr = parroquiasTrs[j];
              parroquiaTr = $(parroquiaTr);
              parroquiaTds = parroquiaTr.find("td > table:first-child td");
              if (parroquiaTds.length > 0) {
                parroquiaImg = $(parroquiaTds[0]).find("img").attr("src");
              }
              if (parroquiaTds.length > 1) {
                parroquiaInfo = $(parroquiaTds[1]);
                diocesisName = parroquiaInfo.find("font:first-child").text();
                parroquiaName = parroquiaInfo.find("font.nom_parroquia_amarillo > b").text();
                parroquiaRegexp = /([^:]+):(.*)/g;
                names = parroquiaRegexp.exec(parroquiaName);
                if (names.length === 3) {
                  parroquiaType = names[1];
                  parroquiaName = names[2];
                } else {
                  console.log("Error! please fix this: " + parroquiaName);
                }
                addressPre = parroquiaInfo.find("font.datoscolonia").get(1);
                address = addressPre != null ? $(addressPre).text() : "";
                other = parroquiaInfo.find("font:last-child").text();
              }
              parroquiaHref = "";
              parroquiaAnchor = parroquiaTr.find("td > table:last-child a");
              if (parroquiaAnchor.length > 0) {
                parroquiaHref = parroquiaAnchor.attr("href");
                idsRegexp = /&id=(\d+)&d=(\d+)/g;
                ids = idsRegexp.exec(parroquiaHref);
                if (ids.length === 3) {
                  parroquiaId = ids[1];
                  diocesisId = ids[2];
                } else {
                  console.log("Error! please fix this: " + parroquiaHref);
                }
              }
              parroquia = {
                diocesis_name: diocesisName,
                name: parroquiaName,
                parroquia_type: parroquiaType,
                address: address,
                other: other,
                href: parroquiaHref,
                id: parroquiaId,
                diocesis_id: diocesisId,
                state_id: stateId,
                city_id: cityId
              };
              results.push(parroquia);
            }
            return results;
          })();
          defered.resolve(adhmp.parroquias);
        });
        console.log("END adhmp.getParroquias()");
        return defered.promise;
      };
      adhmp.getMoreParroquiaInfo = function(parroquia, defered) {
        console.log("adhmp.getMoreParroquiasInfo()");
        if ((parroquia == null) || (parroquia.id == null) || (parroquia.diocesis_id == null)) {
          return;
        }
        return adhmp.call('DHM-parse-parroquia', {
          id: parroquia.id,
          d: parroquia.diocesis_id
        }, function(error, html) {
          var addressHtml, addressLine2, addressText, datosGeneralesHtml, day, dayHtml, daySchedule, day_id, day_ids, days, daysHtml, doesNotExist, doesNotExistRegexp, eventHtml, eventInfo, eventRegexp, eventTime, eventTypeName, getInfo, hour, i, meridiem, mins, parroquiaHtml, pictureHtml, scheduleHtml, serviciosHtml, src, stACt, stACtRegexp, tDay, timeParts, timeRegexp, mapaHtml;
          parroquiaHtml = $(html);
          if ((parroquiaHtml != null) && parroquiaHtml.length >= 1) {
            pictureHtml = parroquiaHtml.find("span.titulo2 > center > img");
            if ((pictureHtml != null) && pictureHtml.length > 0) {
              src = pictureHtml.attr("src");
              if (src != null) {
                doesNotExistRegexp = /nodisponible\.jpg/g;
                doesNotExist = doesNotExistRegexp.exec(src);
                if (doesNotExist == null) {
                  parroquia.img = {
                    url: src
                  };
                }
              }
            }
            datosGeneralesHtml = parroquiaHtml.find("strong:contains('Datos generales')").closest("tr").next();
            if ((datosGeneralesHtml != null) && datosGeneralesHtml.length > 0) {
              addressHtml = datosGeneralesHtml.find("strong:contains('Dirección')").closest("td").next();
              if ((addressHtml != null) && addressHtml.length > 0) {
                addressText = addressHtml.contents().filter(function() {
                  return this.nodeType === 3;
                });
                if ((addressText != null) && addressText.length >= 1) {
                  parroquia.address_line_1 = addressText[0].textContent;
                }
                addressLine2 = addressHtml.find("font:contains(Colonia)");
                if ((addressLine2 != null) && addressLine2.length > 0) {
                  parroquia.address_line_2 = addressLine2.next().text();
                }
                if ((addressText != null) && addressText.length >= 3) {
                  stACtRegexp = /(.*),(.*)/g;
                  stACt = stACtRegexp.exec(addressText[2].textContent);
                  if (stACt != null) {
                    if (stACt.length >= 2) {
                      parroquia.city = _.trim(stACt[1]);
                    }
                    if (stACt.length >= 3) {
                      parroquia.state = _.trim(stACt[2]);
                    }
                  }
                }
              }
              getInfo = function(field, parroquiaField, parroquia) {
                var elem;
                elem = datosGeneralesHtml.find("b:contains('" + field + "')");
                if ((elem == null) || elem.length === 0) {
                  return;
                }
                elem = elem.closest("font");
                if ((elem == null) || elem.length === 0) {
                  return;
                }
                elem = elem.next();
                if ((elem == null) || elem.length === 0) {
                  return;
                }
                return parroquia["" + parroquiaField] = elem.text();
              };
              getInfo("C.P.", "postal_code", parroquia);
              getInfo("A.P.", "postal_code_a", parroquia);
              getInfo("Teléfono", "phone", parroquia);
              getInfo("Mail", "email", parroquia);
              getInfo("Website", "website", parroquia);
            }
            day_ids = {
              lunes: 1,
              martes: 2,
              miercoles: 3,
              jueves: 4,
              viernes: 5,
              sabado: 6,
              domingo: 7
            };
            serviciosHtml = parroquiaHtml.find("strong:contains(Servicios)").closest("tr").next();
            if (serviciosHtml.length > 0) {
              parroquia.servicios = serviciosHtml.html();
            }
            mapaHtml = parroquiaHtml.find("strong:contains('Mapa de ubicación')").closest("tr").next().find("iframe");
            if (mapaHtml.length > 0) {
              var urlObj = url.parse(mapaHtml.attr("src"));
              if(urlObj != null){
                var queryString = urlObj.query;
                var llRegexp = /&ll=(-?\d+.\d+),(-?\d+.\d+)&/g
                var ll = llRegexp.exec(queryString)
                if(ll != null && ll.length >= 3){
                  parroquia.location = {
                    lat: ll[1],
                    lon: ll[2]
                  }
                }
              }
            }
            scheduleHtml = parroquiaHtml.find("strong:contains(Misas)").closest("tr").next();
            if (scheduleHtml.length > 0) {
              daysHtml = scheduleHtml.find("b");
              daysHtml = (function() {
                var j, ref, results;
                results = [];
                for (i = j = 0, ref = daysHtml.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                  results.push(daysHtml.get(i));
                }
                return results;
              })();
              days = (function() {
                var j, len, results;
                results = [];
                for (j = 0, len = daysHtml.length; j < len; j++) {
                  dayHtml = daysHtml[j];
                  dayHtml = $(dayHtml);
                  day = dayHtml.text();
                  scheduleHtml = dayHtml.next().next();
                  if (scheduleHtml.length > 0) {
                    daySchedule = (function() {
                      var k, len1, ref, results1;
                      ref = scheduleHtml.find("font");
                      results1 = [];
                      for (k = 0, len1 = ref.length; k < len1; k++) {
                        eventHtml = ref[k];
                        eventHtml = $(eventHtml);
                        eventRegexp = /(.*)\s-\s(.*)/g;
                        timeRegexp = /(\d{1,2}):(\d{2})\s*([AP].M.)/gi;
                        eventInfo = eventRegexp.exec(eventHtml.text());
                        if (eventInfo != null) {
                          if (eventInfo.length >= 2) {
                            eventTypeName = eventInfo[1];
                          }
                          if (eventInfo.length >= 3) {
                            eventTime = eventInfo[2];
                            timeParts = timeRegexp.exec(eventTime);
                            if (timeParts.length >= 4) {
                              hour = timeParts[1];
                              mins = timeParts[2];
                              meridiem = timeParts[3].replace(/\./g, '');
                              eventTime = {
                                hour: hour,
                                mins: mins,
                                meridiem: meridiem
                              };
                            }
                          }
                        }
                        results1.push({
                          type: eventTypeName,
                          start_time: eventTime
                        });
                      }
                      return results1;
                    })();
                  }
                  tDay = _.lowerCase(_.deburr(day));
                  if (day_ids[tDay] != null) {
                    day_id = day_ids[tDay];
                  }
                  results.push({
                    id: day_id,
                    name: day,
                    events: daySchedule
                  });
                }
                return results;
              })();
              parroquia.schedule = {
                days: days
              };
              //console.log(parroquia);
            }
          }
          adhmp.updated += 1;
          if (defered != null) {
            defered.resolve(parroquia);
          }
          return console.log("END adhmp.getMoreParroquiasInfo()");
        });
      };
      adhmp.getAllParroquiasMoreInfo = function() {
        var defered, moreParroquiasInfo, waitAllMoreParroquiasInfo;
        adhmp.updated = 0;
        defered = $q.defer();
        waitAllMoreParroquiasInfo = function(parroquias) {
          console.log("waitAllMoreParroquiasInfo() - Inner");
          return moreParroquiasInfo(parroquias).then(function(updatedParroquias) {
            console.log("gotParroquias");
            return defered.resolve(updatedParroquias);
          }, function(error) {
            return defered.reject("getAllParroquiasMoreInfo -> waitAllMoreParroquiasInfo Error " + error);
          });
        };
        moreParroquiasInfo = function(parroquias) {
          var allDefered, defer, defers, i, promises, requests;
          console.log("moreParroquiasInfo()");
          defers = (function() {
            var j, ref, results;
            results = [];
            for (i = j = 0, ref = parroquias.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              console.log("moreParroquiasInfo() - defer");
              results.push($q.defer());
            }
            return results;
          })();
          promises = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = defers.length; j < len; j++) {
              defer = defers[j];
              console.log("moreParroquiasInfo() - promise");
              results.push(defer.promise);
            }
            return results;
          })();
          allDefered = $q.all(promises);
          requests = _.zip(defers, parroquias);
          _.forEach(requests, function(request) {
            var parroquia;
            defer = request[0];
            parroquia = request[1];
            return adhmp.getMoreParroquiaInfo(parroquia, defer);
          });
          return allDefered;
        };
        if ((adhmp.parroquias == null) || adhmp.parroquias.length === 0) {
          adhmp.getParroquias().then(waitAllMoreParroquiasInfo, function(error) {
            console.log("getAllParroquiasMoreInfo: Error - " + error);
            return defered.reject(error);
          });
        } else {
          console.log("getAllParroquiasMoreInfo : get more parroquia info from waitAllMoreParroquiasInfo");
          waitAllMoreParroquiasInfo(adhmp.parroquias);
        }
        return defered.promise;
      };
      adhmp.updateAllParroquias = function() {
        var defered;
        defered = $q.defer();
        adhmp.getAllParroquiasMoreInfo().then(function(parroquias) {
          var allDefered, defer, defers, i, promises, requests;
          console.log("updateAllParroquias - updating all parroquias now");
          adhmp.inserted = 0;
          defers = (function() {
            var j, ref, results;
            results = [];
            for (i = j = 0, ref = adhmp.parroquias.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              results.push($q.defer());
            }
            return results;
          })();
          promises = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = defers.length; j < len; j++) {
              defer = defers[j];
              results.push(defer.promise);
            }
            return results;
          })();
          allDefered = $q.all(promises);
          requests = _.zip(defers, adhmp.parroquias);
          _.forEach(requests, function(request) {
            var j, key, len, parroquia, ref;
            defer = request[0];
            parroquia = _.clone(request[1]);
            ref = _.keys(parroquia);
            for (j = 0, len = ref.length; j < len; j++) {
              key = ref[j];
              if (_.startsWith(key, "$$")) {
                delete parroquia[key];
              }
            }
            parroquia = JSON.parse(angular.toJson(parroquia));
            return adhmp.call('parroquias.parse-upsert', parroquia, function(error, result) {
              if (error == null) {
                console.log("inserted " + parroquia.name);
                adhmp.inserted += 1;
                return defer.resolve(parroquia);
              } else {
                console.log("error inserting " + parroquia.name);
                console.log(result);
                return defer.reject("Error: " + parroquia.name);
              }
            });
          });
          return allDefered.then(function() {
            return defered.resolve(adhmp.parroquias);
          }, function(error) {
            return defered.reject("updateAllParroquias (1) : Error " + error);
          });
        }, function(error) {
          defered.reject("updateAllParroquias (2) : Error " + error);
          return console.log("updateAllParroquias (2) : Error " + error);
        });
        return defered.promise;
      };
      adhmp.testUpdateAll = function() {
        return adhmp.updateAllParroquias().then(function() {
          return console.log("updatedAllParroquiqs!");
        }, function(error) {
          return console.log("" + error);
        });
      };
    }
  };
});
