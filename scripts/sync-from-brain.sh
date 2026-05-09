#!/usr/bin/env bash
# Mirror the 10-claim dossiers + synthesis from ~/Brain/ into the site's
# /content/drafts directory for manual porting into MDX.
#
# Frontmatter schemas differ between the Brain wiki and the site's content
# collection — the site needs `number`, `shortTitle`, `description`, `thread`
# fields that aren't in the Brain dossiers. So this script copies the raw
# markdown into a drafts dir; the user manually finishes the MDX in
# site/src/content/claims/ for each of the remaining 9 claims.
#
# Usage:  ./scripts/sync-from-brain.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAIN_DIR="$HOME/Brain/wiki/research/2026-05-09-ai-brain-context"
DRAFT_DIR="$REPO_ROOT/site/src/content/drafts"

if [[ ! -d "$BRAIN_DIR" ]]; then
  echo "Brain research dir not found: $BRAIN_DIR" >&2
  exit 1
fi

mkdir -p "$DRAFT_DIR"

count=0
for src in "$BRAIN_DIR"/claim-*.md "$BRAIN_DIR"/synthesis.md "$BRAIN_DIR"/index.md; do
  [[ -f "$src" ]] || continue
  base="$(basename "$src" .md)"
  dest="$DRAFT_DIR/$base.md"
  cp "$src" "$dest"
  count=$((count + 1))
  echo "  $base.md"
done

echo
echo "Mirrored $count file(s) to $DRAFT_DIR/"
echo
echo "Next:"
echo "  - For each remaining claim, copy/edit the markdown into"
echo "    site/src/content/claims/claim-NN.mdx with the site frontmatter schema"
echo "    (see site/src/content/config.ts and site/src/content/claims/claim-09.mdx)."
echo "  - Already-styled exemplar: claim-09.mdx (Active Forgetting)."
