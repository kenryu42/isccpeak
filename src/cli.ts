#!/usr/bin/env node
import { formatStatusline, getPeakStatus } from "@/peak";

async function readStdinAsync(): Promise<string | null> {
  if (process.stdin.isTTY) {
    return null;
  }

  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      const trimmed = data.trim();
      resolve(trimmed || null);
    });
    process.stdin.on("error", () => {
      resolve(null);
    });
  });
}

const statusline = formatStatusline(getPeakStatus());
const stdin = await readStdinAsync();

// Skip JSON stdin (starts with {)
if (stdin && !stdin.startsWith("{")) {
  console.log(`${stdin} | ${statusline}`);
} else {
  console.log(statusline);
}
