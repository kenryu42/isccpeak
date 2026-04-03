# isccpeak

A CLI statusline showing Claude Code peak-hour status with a live countdown.

```
🟢 2x · 4h 30m left        ← off-peak, 2× usage multiplier active
🔴 Peak · 2h 15m left      ← peak hours, standard usage
```

## Table of Contents

- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Output Format](#output-format)
- [Piping with Other Statuslines](#piping-with-other-statuslines)
- [Peak Hours](#peak-hours)
- [Development](#development)
- [License](#license)

## Quick Start

Add to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bunx isccpeak"
  }
}
```

Changes take effect immediately — no restart needed.

## Manual Setup

### Using Bun (recommended)

```json
{
  "statusLine": {
    "type": "command",
    "command": "bunx isccpeak"
  }
}
```

### Using npm

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y isccpeak"
  }
}
```

### Piping with Other Statuslines

If you already have a statusline command, pipe it into isccpeak to append the peak indicator:

```json
{
  "statusLine": {
    "type": "command",
    "command": "your-existing-command | bunx isccpeak"
  }
}
```

This produces output like:

```
your status text | 🟢 2x · 4h 30m left
```

> **Note:** JSON stdin (e.g. from commands that output `{...}`) is automatically ignored — only plain text is prepended.

## Output Format

| State    | Example                    | Meaning                                     |
| -------- | -------------------------- | ------------------------------------------- |
| Off-peak | `🟢 2x · 4h 30m left`     | 2× multiplier active, time until peak starts |
| Peak     | `🔴 Peak · 2h 15m left`   | Peak hours, time until peak ends             |

Countdown formats: `<1m`, `42m`, `1h 30m`.

## Peak Hours

Peak hours are **Monday–Friday, 5:00 AM – 10:59 AM PT** (1:00 PM – 7:00 PM GMT) ([Source](https://x.com/trq212/status/2037254607001559305?s=20)).

During peak hours, your 5-hour session limits are consumed faster. Outside these hours (evenings, nights, weekends), limits reset at the normal rate.

## Development

Requires Bun as the dev toolchain. The shipped artifact targets **Node.js ≥ 18**.

```bash
bun install         # install dependencies
bun run check       # full CI: typecheck → knip → lint → tests + coverage
bun run build       # bundle to dist/cli.js (Node.js target)
```

## License

[MIT](LICENSE)
