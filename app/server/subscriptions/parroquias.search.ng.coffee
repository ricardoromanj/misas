#
# Published: parroquias.search
#
# This method will return parroquias based upon the input
# search query (q). It queries based on the name, or description
# of the parroquias.
# 
# TODO: Should acomodate queries for dates, times, and other
# stuff later on.
Meteor.publish 'parroquias.search', (options, q)->
  if not options?
    options = {}
  if not q?
    q = ""
  selector = {
    name:
      $regex: '.*' + ( "#{q}" || '') + ( "#{q}" && '.*')
      $options: 'i'
  }
  return Parroquias.find(selector, options)
