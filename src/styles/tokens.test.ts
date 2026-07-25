import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");
const excluded = new Set(["mocks", "components/ui", "styles"]);
const forbidden = /#[0-9a-f]{3,8}|(?:bg|text|border)-(?:green|yellow|red|blue|cyan|violet|emerald|amber)-/i;

function runtimeSource(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name);
    const projectPath = relative(sourceRoot, file).replace(/\\/g, "/");
    if (entry.isDirectory()) return excluded.has(projectPath) ? [] : runtimeSource(file);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts") && !entry.name.endsWith(".test.tsx") ? [file] : [];
  });
}

describe("UI token guardrail", () => {
  it("does not allow raw palette values in runtime UI source", () => {
    const violations = runtimeSource(sourceRoot).flatMap((file) =>
      readFileSync(file, "utf8").split(/\r?\n/).flatMap((line, index) =>
        forbidden.test(line) ? [`${relative(sourceRoot, file)}:${index + 1}`] : []),
    );

    expect(violations).toEqual([]);
  });
});
