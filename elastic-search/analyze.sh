curl -XGET "$SEARCH_ELASTIC_URL/misas/_analyze?pretty" -d "
{
  \"analyzer\": \"misas_text_analyzer\",
  \"text\": \"$1\"
}
"
