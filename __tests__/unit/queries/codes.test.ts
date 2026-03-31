/**
 * Queries Codes Tests
 */
import * as codesQueries from "@/lib/queries/codes";

describe("Codes Queries", () => {
  it("should export useCodes hook", () => {
    expect(typeof codesQueries.useCodes).toBe("function");
  });

  it("should export useCodeDetail hook", () => {
    expect(typeof codesQueries.useCodeDetail).toBe("function");
  });
});
