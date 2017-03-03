curl -XGET "$SEARCH_ELASTIC_URL/misas/parroquias/k2mqGcm5CCh4We2zy?pretty" -d ' 
{
  "fields" : ["text"],
  "offsets" : true,
  "payloads" : true,
  "positions" : true,
  "term_statistics" : true,
  "field_statistics" : true
}
'
