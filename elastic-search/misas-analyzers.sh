curl -XPOST "$ELASTIC_SEARCH_URL/misas/_close"
curl -XPUT "$ELASTIC_SEARCH_URL/misas/_settings?pretty" -d '{
  "analysis": {
    "analyzer": {
      "misas_text_analyzer": {
        "type": "custom",
        "filter": ["standard", "asciifolding", "lowercase"],
        "tokenizer": "standard"
      },
      "misas_word_edges_analyzer": {
        "type": "custom",
        "filter": ["standard", "asciifolding", "lowercase"],
        "tokenizer": "misas_edge_ngram_tokenizer"
      }
    },
    "tokenizer": {
      "misas_edge_ngram_tokenizer": {
        "type": "edgeNGram",
        "min_gram": "1",
        "max_gram": "5",
        "token_chars": ["letter", "digit"]
      }
    }
  }
}
'
curl -XPOST "$ELASTIC_SEARCH_URL/misas/_open"
