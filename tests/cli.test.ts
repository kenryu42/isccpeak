import { describe, expect, test } from "bun:test";

const CLI = ["bun", "src/cli.ts"] as const;

async function run(stdin?: string): Promise<string> {
  const proc = Bun.spawn([...CLI], {
    stdin: stdin !== undefined ? new Blob([stdin]) : undefined,
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output.trim();
}

describe("cli", () => {
  test("no stdin outputs statusline only", async () => {
    const output = await run();
    expect(output).toMatch(/[🔴🟢]/u);
  });

  test("piped text stdin prepends to statusline", async () => {
    const output = await run("hello world");
    expect(output).toMatch(/^hello world \| [🔴🟢]/u);
  });

  test("JSON stdin is skipped", async () => {
    const output = await run('{"json":true}');
    expect(output).toMatch(/^[🔴🟢]/u);
    expect(output).not.toContain("{");
  });

  test("empty stdin outputs statusline only", async () => {
    const output = await run("");
    expect(output).toMatch(/^[🔴🟢]/u);
  });
});
