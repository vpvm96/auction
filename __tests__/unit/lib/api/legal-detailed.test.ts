/**
 * Legal API Detailed Tests
 */
import { fetchPrivacyPolicy, fetchTerms } from "@/lib/api/legal";
import { apiClient } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const mockLegalDocument = {
  version: "1.0.0",
  effectiveDate: "2026-01-01",
  content: "약관 내용입니다.",
};

describe("Legal API detailed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchTerms", () => {
    it("should call apiClient with terms endpoint", async () => {
      mockedApiClient.mockResolvedValue(mockLegalDocument);

      await fetchTerms();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/legal/terms",
      );
    });

    it("should return legal document response", async () => {
      mockedApiClient.mockResolvedValue(mockLegalDocument);

      const result = await fetchTerms();

      expect(result).toEqual(mockLegalDocument);
    });
  });

  describe("fetchPrivacyPolicy", () => {
    it("should call apiClient with privacy endpoint", async () => {
      mockedApiClient.mockResolvedValue(mockLegalDocument);

      await fetchPrivacyPolicy();

      expect(mockedApiClient).toHaveBeenCalledWith(
        "/hammers/hammer-users/legal/privacy",
      );
    });

    it("should return legal document response", async () => {
      const privacyDoc = { ...mockLegalDocument, content: "개인정보처리방침 내용입니다." };
      mockedApiClient.mockResolvedValue(privacyDoc);

      const result = await fetchPrivacyPolicy();

      expect(result).toEqual(privacyDoc);
    });
  });
});
