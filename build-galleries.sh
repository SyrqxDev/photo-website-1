#!/bin/bash

GALLERIES_DIR="galleries"
MAX_SIZE="1600x1600>"
QUALITY="80"

echo "🔍 Processing galleries..."

for gallery in "$GALLERIES_DIR"/*; do
  [ -d "$gallery" ] || continue

  echo "📁 Gallery: $(basename "$gallery")"

  THUMBS="$gallery/thumbs"
  mkdir -p "$THUMBS"

  # Generate thumbnails only if missing
  for img in "$gallery"/*.{jpg,jpeg,png,webp}; do
    [ -f "$img" ] || continue
    filename=$(basename "$img")

    if [ ! -f "$THUMBS/$filename" ]; then
      echo "🖼 Creating preview: $filename"
      magick "$img" \
        -resize "$MAX_SIZE" \
        -strip \
        -quality "$QUALITY" \
        "$THUMBS/$filename"
    fi
  done

  # Generate manifest.json
  echo "📝 Generating manifest.json"
  ls "$gallery" | grep -Ei '\\.(jpg|jpeg|png|webp)$' | sort > "$gallery/.tmp_manifest"

  jq -R . "$gallery/.tmp_manifest" | jq -s . > "$gallery/manifest.json"
  rm "$gallery/.tmp_manifest"

done

echo "✅ All galleries processed successfully."

