#
# Published: parroquias
#
# This method will returned parroquias based on contextual
# information such as radius from person's location, and
# any other contextual information we can get our hands on
# such as perfered parroquias, parroquias most attended,
# parroquias with most friends attended
#
Meteor.publish 'parroquias', ()->
  selector = {}
  return Parroquias.find(selector)
