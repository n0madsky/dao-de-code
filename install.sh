#!/usr/bin/env bash
set -euo pipefail

# Install dao-de-code skills for local AI coding harnesses.
# Usage: ./install.sh [--lang en|zh-hans|zh-hant|all]   (default: all)
# Symlinks the chosen skill(s) into:
#   ~/.agents/skills/   (Codex, pi, Copilot, Gemini, Cursor, Amp, Goose, Factory, Windsurf, opencode)
#   ~/.claude/skills/   (Claude Code)
# Safe to re-run; a pre-existing real file/dir is backed up to <path>.bak.<timestamp>.

REPO="$(cd "$(dirname "$0")" && pwd)"

lang=all
case "${1:-}" in
	"") ;;
	--lang) lang="${2:-all}" ;;
	*) echo "usage: $0 [--lang en|zh-hans|zh-hant|all]" >&2; exit 1 ;;
esac

case "$lang" in
	en)      names="tao-en" ;;
	zh-hans) names="tao" ;;
	zh-hant) names="tao-zh-hant" ;;
	all)     names="tao tao-zh-hant tao-en" ;;
	*) echo "unknown --lang: $lang" >&2; exit 1 ;;
esac

link() {
	src="$1"
	dst="$2"
	if [ "$(readlink "$dst" 2>/dev/null)" = "$src" ]; then
		return
	fi
	mkdir -p "$(dirname "$dst")"
	if [ -e "$dst" ] && [ ! -L "$dst" ]; then
		bak="$dst.bak.$(date +%Y%m%d-%H%M%S)"
		mv "$dst" "$bak"
		echo "backed up $dst -> $bak"
	fi
	ln -sfn "$src" "$dst"
	echo "linked $dst -> $src"
}

for name in $names; do
	link "$REPO/skills/$name" "$HOME/.agents/skills/$name"
	link "$REPO/skills/$name" "$HOME/.claude/skills/$name"
done

echo "done ($lang)"
