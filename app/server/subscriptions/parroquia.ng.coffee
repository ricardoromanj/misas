#
# Published: parroquia
#
#
Meteor.publish 'parroquia', (id)->
  if not id?
    id = ''
  selector = {
    _id: id
  }
  return Parroquias.find(selector)
