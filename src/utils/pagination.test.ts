import { describe, expect, it } from "vitest";
import { paginate } from "./pagination";

describe("paginate", () => {
  const items = Array.from({ length: 23 }, (_, index) => index + 1);

  it("returns ten items per page by default", () => {
    expect(paginate(items, 2)).toMatchObject({ currentPage: 2, totalPages: 3, items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] });
  });

  it("clamps invalid pages to the valid range", () => {
    expect(paginate(items, 0).currentPage).toBe(1);
    expect(paginate(items, 99).currentPage).toBe(3);
  });
});
