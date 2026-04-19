#!/usr/bin/env bash
set -euo pipefail

if ! git diff --quiet -- drizzle/ || ! git diff --cached --quiet -- drizzle/; then
  echo "error: drizzle/ has uncommitted changes; commit or stash first" >&2
  exit 1
fi

before=$(ls drizzle/ 2>/dev/null | sort)

yarn --silent db:generate >/dev/null

after=$(ls drizzle/ 2>/dev/null | sort)

new_files=$(comm -13 <(echo "$before") <(echo "$after") || true)
changed=$(git status --porcelain -- drizzle/ || true)

if [ -n "$new_files" ] || [ -n "$changed" ]; then
  echo "error: schema changes detected without matching migration" >&2
  echo "run \`yarn db:generate\` and commit the generated files" >&2
  if [ -n "$new_files" ]; then
    echo "$new_files" | while read -r f; do
      [ -n "$f" ] && rm -f "drizzle/$f"
    done
  fi
  git checkout -- drizzle/ 2>/dev/null || true
  exit 1
fi
