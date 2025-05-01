#!/usr/bin/env bash
set -e

# 1) Go to the repository root (where package.json lives)
cd "$(git rev-parse --show-toplevel)"

VITEST_BIN="./node_modules/.bin/vitest"

# 2) Ensure Vitest binary exists
if [ ! -x "$VITEST_BIN" ]; then
  echo "❌ Could not find $VITEST_BIN"
  exit 1
fi

# 3) Determine the base for comparison: upstream branch or initial commit
if git rev-parse --verify --quiet @{u} >/dev/null; then
  BASE="@{u}"
else
  BASE=$(git rev-list --max-parents=0 HEAD)
fi

# 4) Collect all added/copied/modified files
CHANGED=$(git diff --name-only "$BASE" HEAD --diff-filter=ACM)
declare -a TEST_FILES=()

for file in $CHANGED; do
  # If it's already a test file, include it directly
  if [[ "$file" =~ \.(spec|test)\.(ts|js|tsx|jsx)$ ]]; then
    TEST_FILES+=("$file")
    continue
  fi

  # Otherwise, try to find a matching test by filename
  ext="${file##*.}"
  dir=$(dirname "$file")
  name=$(basename "$file" ".$ext")

  for suf in spec test; do
    candidate="$dir/$name.$suf.$ext"
    if [[ -f "$candidate" ]]; then
      TEST_FILES+=("$candidate")
    fi

    candidate="$dir/__tests__/$name.$suf.$ext"
    if [[ -f "$candidate" ]]; then
      TEST_FILES+=("$candidate")
    fi
  done
done

# 5) Remove duplicates
IFS=$'\n' UNIQUE_TESTS=($(sort -u <<<"${TEST_FILES[*]}"))
unset IFS

# 6) Exit if there’s nothing to test
[ ${#UNIQUE_TESTS[@]} -eq 0 ] && exit 0

# 7) Run Vitest on the selected tests
"$VITEST_BIN" run "${UNIQUE_TESTS[@]}" --passWithNoTests