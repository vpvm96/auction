/**
 * Sample unit test to verify Jest setup
 */

describe("Jest Setup Verification", () => {
  it("should run basic test", () => {
    expect(true).toBe(true);
  });

  it("should perform arithmetic", () => {
    expect(2 + 2).toBe(4);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  it("should mock async functions", async () => {
    const mockFn = jest.fn(async () => "mocked");
    const result = await mockFn();
    expect(result).toBe("mocked");
    expect(mockFn).toHaveBeenCalled();
  });
});
