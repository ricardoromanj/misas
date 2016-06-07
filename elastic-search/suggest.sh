curl -XPOST "$SEARCH_ELASTIC_URL/misas/_suggest?pretty" -d "
{
  search_suggestion: {
    text: \"$1\",
    phrase: {
      field: \"name\",
      analyzer: \"misas_text_analyzer\",
      direct_generator: [ 
        {
          suggest_mode: \"popular\",
          field: \"name\",
          size: 10 
        },
        {
          suggest_mode: \"popular\",
          field: \"diocesis_name\",
          size: 10 
        }
      ],
      max_errors: 3,
      gram_size: 3,
      size: 10 
    }
  } 
}
"
