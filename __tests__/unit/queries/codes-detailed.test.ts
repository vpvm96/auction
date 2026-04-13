/**
 * Codes Queries Detailed Tests
 */
import { useCodeDetail, useCodes } from "@/lib/queries/codes";
import { queryKeys } from "@/lib/queries/keys";

jest.mock("@/lib/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/lib/api/codes", () => ({
  fetchCodes: jest.fn(),
  fetchCodeDetail: jest.fn(),
}));

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe("Codes Queries detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseQuery.mockReturnValue({} as ReturnType<typeof useQuery>);
  });

  describe("useCodes", () => {
    it("should call useQuery with correct queryKey when logged in", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useCodes({ parentId: "001" });

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.codes.list({ parentId: "001" }),
          enabled: true,
        }),
      );
    });

    it("should disable query when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useCodes();

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("should use default empty params when called without arguments", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useCodes();

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.codes.list({}),
        }),
      );
    });
  });

  describe("useCodeDetail", () => {
    it("should call useQuery with correct queryKey for valid id", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useCodeDetail(42);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: queryKeys.codes.detail(42),
          enabled: true,
        }),
      );
    });

    it("should disable query when not logged in", () => {
      mockedUseAuthStore.mockReturnValue(false as unknown as ReturnType<typeof useAuthStore>);

      useCodeDetail(42);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    it("should disable query when id is 0", () => {
      mockedUseAuthStore.mockReturnValue(true as unknown as ReturnType<typeof useAuthStore>);

      useCodeDetail(0);

      expect(mockedUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });
});
