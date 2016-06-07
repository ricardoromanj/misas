curl -XGET "$SEARCH_ELASTIC_URL/misas/parroquias/_search?pretty" -d "
{
  query: {
    match: {
      _all: \"$1\"
    }
  }
}
"
