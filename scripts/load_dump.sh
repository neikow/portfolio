curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/dump > dump.json

curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @dump.json http://localhost:3000/api/dump/import