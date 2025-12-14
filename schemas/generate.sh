#!/bin/sh


mkdir gen

for f in *.yaml; do
    # Determine the output filename by replacing the extension
    filename=$(basename "$f" .yaml)

    # Run yq to convert the file
    echo "Converting $f to ${filename}.json..."
    yq -o=json "$f" > gen/"${filename}.json"
done


echo "Generating types"

quicktype gen/building.json  \
    --src-lang schema \
    --just-types \
    --top-level building \
    --lang typescript \
    --out types.d.ts


quicktype openapi.yml  \
    --src-lang openapi \
    --out types.d.ts
