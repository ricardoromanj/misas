curl -XPUT "$ELASTIC_SEARCH_URL/misas/_mapping/users?pretty" -d '
  {
    "users": {
      "dynamic": false,
      "properties": {
        "createdAt": {
          "type": "date"
        },
        "username": {
          "type": "string"
        },
        "emails": {
          "properties": {
            "address": { "type": "string" },
            "verified": { "type": "boolean" }
          }
        },
        "profile": {
          "properties": {
            "name": { "type": "string" }
          }
        }
      }
    }  
  }
'
