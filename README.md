# ccpeak

A CLI that shows whether Claude Code is in peak or off-peak API hours, with a live countdown.

> [!WARNING]
> This CLI will only live until ~March 29, 2026 ([Source](https://x.com/claudeai/status/2032911276226257206)).

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
    "command": "bunx ccpeak"
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
    "command": "bunx ccpeak"
  }
}
```

### Using npm

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y ccpeak"
  }
}
```

### Piping with Other Statuslines

If you already have a statusline command, pipe it into ccpeak to append the peak indicator:

```json
{
  "statusLine": {
    "type": "command",
    "command": "your-existing-command | bunx ccpeak"
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

Peak hours are **Monday–Friday, 5:00 AM – 10:59 AM PT** ([Source](https://x.com/claudeai/status/2032911277497135523?s=20)).

Outside these hours (evenings, nights, weekends), the 2× usage multiplier applies.

## Development

Requires Bun as the dev toolchain. The shipped artifact targets **Node.js ≥ 18**.

```bash
bun install         # install dependencies
bun run check       # full CI: typecheck → knip → lint → tests + coverage
bun run build       # bundle to dist/cli.js (Node.js target)
```

## License

[MIT](LICENSE)
