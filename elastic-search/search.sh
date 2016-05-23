curl -XGET "$SEARCH_ELASTIC_URL/misas/parroquias/_count?pretty" -d '
{
  "query": {
    "match": {
      "_all": "senor"
    }
  }
}
'
