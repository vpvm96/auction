import { apiClient, buildQueryString } from "@/lib/api/client";
import { fetchRandomQuizzes, submitQuizAttempt } from "@/lib/api/quizzes";

jest.mock("@/lib/api/client", () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<
  typeof buildQueryString
>;

describe("Quizzes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBuildQueryString.mockReturnValue("?count=3");
  });

  it("should request random quizzes", async () => {
    mockedApiClient.mockResolvedValue([]);

    await fetchRandomQuizzes();

    expect(mockedBuildQueryString).toHaveBeenCalledWith({ count: 3 });
    expect(mockedApiClient).toHaveBeenCalledWith(
      "/hammers/hammer-auctions/quizzes/random?count=3",
    );
  });

  it("should request random quizzes with custom count", async () => {
    mockedApiClient.mockResolvedValue([]);
    mockedBuildQueryString.mockReturnValue("?count=5");

    await fetchRandomQuizzes(5);

    expect(mockedBuildQueryString).toHaveBeenCalledWith({ count: 5 });
    expect(mockedApiClient).toHaveBeenCalledWith(
      "/hammers/hammer-auctions/quizzes/random?count=5",
    );
  });

  it("should submit quiz attempt", async () => {
    mockedApiClient.mockResolvedValue({
      id: 1,
      quizId: 11,
      selectedIndex: 2,
      isCorrect: true,
      attemptedAt: "2026-04-01T00:00:00.000Z",
    });

    await submitQuizAttempt(11, 2);

    expect(mockedApiClient).toHaveBeenCalledWith(
      "/hammers/hammer-auctions/quizzes/11/attempts",
      {
        method: "POST",
        body: JSON.stringify({ selectedIndex: 2 }),
      },
    );
  });
});
