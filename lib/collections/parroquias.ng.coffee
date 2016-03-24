#@Collection Parroquas
#
# name: "Nuestra Senora de la Paz"    # String with name of parish
# desc: ""                            # Optional String with description
# location:                           # Object for location data
#   lat:                              # Float with latitude information
#   lng:                              # Float with longitude information
# address: "12345 Rancho Agua Ca.."   # String with address of parish
@Parroquias = new Mongo.Collection("parroquias")
