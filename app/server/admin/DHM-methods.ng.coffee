# hora:
#   Todos...-0
#   Desde las 7 a.m.-hora>=7 AND horario>=1
#   Desde las 8 a.m.-hora>=8 AND horario>=1
#   Desde las 9 a.m.-hora>=9 AND horario>=1
#   Desde las 10 a.m.-hora>=10 AND horario>=1
#   Desde las 11 a.m.-hora>=11 AND horario>=1
#   Desde las 12 p.m.-hora>=0 AND horario>=2
#   Desde las 1 p.m.-hora>=1 AND horario>=2
#   Desde las 2 p.m.-hora>=2 AND horario>=2
#   Desde las 3 p.m.-hora>=3 AND horario>=2
#   Desde las 4 p.m.-hora>=4 AND horario>=2
#   Desde las 5 p.m.-hora>=5 AND horario>=2
#   Desde las 6 p.m.-hora>=6 AND horario>=2
#   Desde las 7 p.m.-hora>=7 AND horario>=2
#   Desde las 8 p.m.-hora>=8 AND horario>=2
#   Desde las 9 p.m.-hora>=9 AND horario>=2
#   Desde las 10 p.m.-hora>=10 AND horario>=2
# dia: eg. dia=1 (domingo)
#   Todos...-0
#   Domingo-1
#   Lunes-2
#   Martes-3
#   Miercoles-4
#   Jueves-5
#   Viernes-6
#   Sabado-7
# tipo de misa:
#   Todos...-0
#   Carismatica-3
#   Con Ninos-4
#   Diaria-1
#   Juvenil-5
#   Precepto Dominical-2
#   Uncion de Enfermos-6
#   Para no oyentes-7
#   En latin-9
# parroquia: 
#   Es usado para buscar parroquias.
# Get all states:
#     
# Get all cities:
# I don't think you need specifiy fec.
# 'ajax.asp?op=1&d=1&e=' + (state id) + '&fec=' + Date()
#
#
#
#
website="http://www.dondehaymisa.com/"
Meteor.methods(
  'DHM-parse-all-states': ()->
    @.unblock()
    result = HTTP.get(website+"ajax2.asp?op=1&p=1&i=&edo=")
    if result?
      return result.content
    return ""
  'DHM-parse-all-cities': (stateId)->
    @.unblock()
    console.log "requesting @"+website+"ajax2.asp?op=2&p=1&e="+stateId+"&i=&sid="+Math.random()
    result = HTTP.get(website+"ajax2.asp?op=2&p=1&e="+stateId+"&i=")
    if result?
      return result.content
    return ""
)
