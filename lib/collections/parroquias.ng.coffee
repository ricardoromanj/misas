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
#        #when weekly
#        weekly:   
#          mon: 
#            start_time: 
#            end_time:
#          sun: 
#            start_time:
#            end_time:
#        #when monthly
#        monthly:  #debemos de pensar mejor como hacer esto
#          day: #Number 1...31 or -1..-31
#        #Array of Objects containing days on which to repeat event

@Parroquias = new Mongo.Collection("parroquias")

