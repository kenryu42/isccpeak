#!/usr/bin/env node
import { formatStatusline, getPeakStatus } from "./peak";

const statusline = formatStatusline(getPeakStatus());

let stdin = "";
const isTTY = process.stdin.isTTY;

if (!isTTY) {
  stdin = await Bun.stdin.text();
  stdin = stdin.trim();
}

// Skip JSON stdin (starts with {)
if (stdin && !stdin.startsWith("{")) {
  process.stdout.write(`${stdin} | ${statusline}\n`);
} else {
  process.stdout.write(`${statusline}\n`);
}
