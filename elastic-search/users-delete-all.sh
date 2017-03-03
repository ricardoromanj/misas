curl -XDELETE "$ELASTIC_SEARCH_URL/misas/users/_query?pretty" -d '{
  "query" : { 
    "match_all" : {}
  }
}'
