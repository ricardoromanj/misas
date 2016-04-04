#@Collection Parroquias 
# 
# name: "parroquia" #String denoting type of event       
#  desc: ""     #String describing the event 
#  info:        #Object containing date/time/scheduled information
#    type:      #String denoting type "single","repeat", ...
#    #when single
#    single:
#      start_time:
#      end_time:
#    #when repeat
#    repeat: 
#      rules:
#        #start date of rule
#        start_time:
#        end_time:
#        #end date of rule
#        #when weekly
#        weekly:   
#          mon: 
#            start_time: 
#            end_time:
#          sun: 
#            start_time:
#            end_time:
#        #when monthly
#        monthly:   #debemos de pensar mejor como hacer esto
#          day:     #Number or Array used to specify the first day = 1
#                   #the last day = -1, or last and first [1, -1]
#          week:   
#            which: #Number of Array used to specify the first week = 1        
#                   #the last week = -1 or last and first [1, -1]
#            day:   #Number or Array used to specify the day of the week 
#         yearly:   #I guess you can now see the pattern
#
#        #Array of Objects containing days on which to repeat event

@Parroquias = new Mongo.Collection("parroquias")

Meteor.methods(
  'parroquias.parse-insert-update': (parroquia)->
    #get parroquia with same else create a new parroquia
    # diocesis_id
    # id
    # state_id
    # m_id
    return
  'parroquias.insert': (parroquia)->
    #create a new parroquia
    return
)
