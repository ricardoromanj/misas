analyzer(){
  if [ ! -z "$1" ]; then
    echo "analyzer: \"$1\","
  fi
}

curl -XGET "$SEARCH_ELASTIC_URL/misas/_analyze?pretty&field=$2" -d "
{
  `analyzer "$3"`
  text: \"$1\"
}
"
