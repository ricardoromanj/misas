curl -XPOST "$SEARCH_ELASTIC_URL/misas/_suggest?pretty" -d "
{
  text: \"$1\",
  search_suggestion: {
    phrase: {
      field: \"name\",
      analyzer: \"misas_text_analyzer\",
      gram_size: 3,
      size: 5
    }
  } 
}
"
