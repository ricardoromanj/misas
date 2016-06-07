curl -XPUT "$ELASTIC_SEARCH_URL/misas/?pretty" -d '
  {
    "mappings": {
      "_default_": {
        "_all": {
          "enabled": false  
        }
      }
    }  
  }
'
