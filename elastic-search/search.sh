field(){
  if [ -z "$3" ]; then
    if [ ! -z "$2" ]; then
      echo "$2: \"$1\""
    else
      echo "_all: \"$1\""
    fi
  else
    if [ ! -z "$2" ]; then
      echo "$2: {
        query: \"$1\",
        analyzer: \"$3\" 
      }"
    else
      echo "_all: {
        query: \"$1\",
        analyzer: \"$3\" 
      }"
    fi
  fi
}
echo "`field "$1" "$2" "$3"`"
curl -XGET "$SEARCH_ELASTIC_URL/misas/parroquias/_search?pretty" -d "
{
  query: {
    match: {
      `field "$1" "$2" "$3"` 
    }
  }
}
"
