# dao-de-code · 代码之道

> *Observe the existing way. Flow like water through the architecture. Make the
> minimal surgical change—then remove half of it. When complete, your
> contribution should be invisible: as if it were always there.*

Taoist principles for minimal, surgical systems programming, packaged as
[Agent Skills](https://agentskills.io) for AI coding agents. Original idea by
[@hypernewbie](https://github.com/hypernewbie).

## Skills

| Skill | Language | Role |
|---|---|---|
| `tao` | 简体中文 | **Canonical reference implementation** |
| `tao-zh-hant` | 繁體中文 | Derived from `tao` (script conversion) |
| `tao-en` | English | Derived from `tao` (translation) |

道德經 is a Chinese work, so the Simplified-Chinese skill is canonical; the
other variants are derived from it. Each skill ships with the complete
老子《道德經》 (all 81 chapters, original Classical Chinese, public domain) as
a reference. Install the language you converse in — each description tells the
agent to trigger only for its own language, so installing several also works.

## Install

Pick one skill name from the table above (`tao`, `tao-zh-hant`, `tao-en`) —
or install all three.

### Claude Code

```
/plugin marketplace add n0madsky/dao-de-code
/plugin install tao-en@dao-de-code
```

Installed as a plugin, the skill is invoked namespaced: `/tao-en:tao-en`
(or `/tao:tao`, `/tao-zh-hant:tao-zh-hant`).

### OpenAI Codex CLI

```
$skill-installer install https://github.com/n0madsky/dao-de-code/tree/master/skills/tao-en
```

Or clone and symlink into `~/.agents/skills/` (see Universal below).

### pi

```
pi install git:github.com/n0madsky/dao-de-code
```

Installs all three skills (pi scans the repo's `skills/` directory). Filter
per-language in your pi settings if desired.

### opencode

opencode reads `~/.claude/skills/` and `~/.agents/skills/` automatically — if
you installed via any route on this page, you are done. Otherwise clone and
add to `opencode.json`:

```json
{ "skills": { "paths": ["/path/to/dao-de-code/skills"] } }
```

### Universal (Copilot CLI, Gemini CLI, Cursor, Amp, Goose, Factory Droid, Windsurf, …)

Nearly every current harness reads `~/.agents/skills/`:

```bash
git clone https://github.com/n0madsky/dao-de-code.git
cd dao-de-code
./install.sh --lang en        # en | zh-hans | zh-hant | all
```

Or with the [skills](https://github.com/vercel-labs/skills) installer:

```bash
npx skills add n0madsky/dao-de-code
```

(Crush reads `~/.config/agents/skills/` instead — copy or symlink the skill
directory there.)

## Repository layout

- `skills/` — source of truth; one directory per language variant.
- `plugins/` — thin per-language Claude Code plugins; `skills` content inside
  is a **generated copy**. Never edit it by hand: edit `skills/`, then run
  `./scripts/sync-plugins.sh`. CI-style check: `./scripts/sync-plugins.sh --check`.

## Contributing

Edit the canonical `skills/tao/SKILL.md` (简体中文) first, propagate to
`tao-zh-hant` (script conversion; classical quotes stay in the original
Traditional characters everywhere) and `tao-en` (translation), then run
`./scripts/sync-plugins.sh`.

## License

[Apache-2.0](LICENSE). The 道德經 text itself is public domain.

## Credits

- Original idea: [@hypernewbie](https://github.com/hypernewbie)
- 老子, for the source material (公元前6世纪)
