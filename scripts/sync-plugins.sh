#!/usr/bin/env bash
set -euo pipefail

# Sync skills/<name> into plugins/<name>/skills/<name> as real copies.
# Symlinks pointing out of a plugin dir aren't reliably preserved by
# marketplace installs, and break on Windows — hence copies, kept honest by --check.
# Usage: ./scripts/sync-plugins.sh [--check]
#   --check: verify the copies match (diff -r); exit 1 on drift.

cd "$(cd "$(dirname "$0")/.." && pwd)"

status=0
for name in tao tao-zh-hant tao-en; do
	src="skills/$name"
	dst="plugins/$name/skills/$name"
	if [ "${1:-}" = --check ]; then
		diff -r "$src" "$dst" || status=1
	else
		rm -rf "$dst"
		mkdir -p "$(dirname "$dst")"
		cp -R "$src" "$dst"
	fi
done
exit "$status"
