import { describe, expect, test } from "bun:test";
import { bumpVersion } from "../scripts/publish";

describe("bumpVersion", () => {
  test("bumps patch version", () => {
    expect(bumpVersion("1.2.3", "patch")).toBe("1.2.4");
  });

  test("bumps minor version", () => {
    expect(bumpVersion("1.2.3", "minor")).toBe("1.3.0");
  });

  test("bumps major version", () => {
    expect(bumpVersion("1.2.3", "major")).toBe("2.0.0");
  });

  test("treats malformed version parts as 0", () => {
    expect(bumpVersion("abc.def.ghi", "patch")).toBe("0.0.1");
  });
});
