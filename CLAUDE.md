# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is ccpeak?

A CLI tool that displays Claude Code API peak/off-peak status as a statusline. It detects whether the current time falls within Anthropic's peak hours (Mon–Fri 5:00–10:59am PT) and outputs a countdown — `🔴 Peak` or `🟢 2x` — suitable for piping into shell prompts or Claude Code's statusline.

## Commands

- `bun test` — run all tests
- `bun test tests/peak.test.ts` — run a single test file
- `bun run build` — bundle to `dist/cli.js` targeting Node.js
- `bun run check` — full local CI: typecheck → knip → biome lint → tests with coverage
- `bun run lint` — biome check with auto-fix
- `bun run typecheck` — tsc type checking
- `bun run knip` — dead code detection

## Architecture

Two source files, one concern each:

- **`src/peak.ts`** — Pure logic: peak-hour detection, countdown math, statusline formatting. All exports are side-effect-free functions. Time is converted to PT via `Intl.DateTimeFormat`.
- **`src/cli.ts`** — Entry point (`#!/usr/bin/env node`). Reads optional stdin, calls peak.ts, writes to stdout. If stdin is plain text, it's prepended to the statusline; JSON stdin is ignored.

Path alias: `@/*` → `src/*` (configured in tsconfig.json).

## Runtime constraint

Bun is the dev toolchain (test runner, bundler, linter), but the **shipped artifact targets Node.js** (`bun build --target=node`). Do not use Bun-only APIs in `src/` — only Node.js-compatible APIs.

## Testing

- Tests use `bun:test` with `setSystemTime()` for deterministic time control.
- Peak tests use a `ptDate()` helper that constructs UTC dates corresponding to specific PT wall-clock times (PST offset = +8h).
- CLI tests spawn `bun src/cli.ts` as a subprocess via `Bun.spawn` and assert on stdout.

## Formatting

Biome: 2-space indent, double quotes, trailing commas (ES5), 100-char line width.
