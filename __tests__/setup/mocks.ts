/**
 * API Mock Setup
 * Uses nock for mocking HTTP requests in Node environment
 * Uses MSW (Mock Service Worker) for jsdom environment
 */

import nock from "nock";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Setup nock interceptors for tests
 * Call this in beforeEach to reset mocks
 */
export const setupApiMocks = () => {
  // Reset any pending mocks
  nock.cleanAll();

  // Enable nock
  if (!nock.isActive()) {
    nock.activate();
  }
};

/**
 * Cleanup after tests
 */
export const cleanupApiMocks = () => {
  nock.cleanAll();
  nock.restore();
};

/**
 * Mock auth API endpoints
 */
export const mockAuthAPI = {
  login: (statusCode = 200, responseBody = {}) => {
    return nock(BASE_URL)
      .post("/auth/login")
      .reply(statusCode, {
        token: "test-token-" + Math.random().toString(36).substr(2, 9),
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        },
        ...responseBody,
      });
  },

  signup: (statusCode = 201, responseBody = {}) => {
    return nock(BASE_URL)
      .post("/auth/signup")
      .reply(statusCode, {
        token: "test-token-" + Math.random().toString(36).substr(2, 9),
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        },
        ...responseBody,
      });
  },

  logout: (statusCode = 200) => {
    return nock(BASE_URL)
      .post("/auth/logout")
      .reply(statusCode, { message: "Logged out successfully" });
  },

  refreshToken: (statusCode = 200, responseBody = {}) => {
    return nock(BASE_URL)
      .post("/auth/refresh")
      .reply(statusCode, {
        token: "test-token-" + Math.random().toString(36).substr(2, 9),
        ...responseBody,
      });
  },

  forgotPassword: (statusCode = 200) => {
    return nock(BASE_URL)
      .post("/auth/forgot-password")
      .reply(statusCode, { message: "Password reset email sent" });
  },

  resetPassword: (statusCode = 200) => {
    return nock(BASE_URL)
      .post("/auth/reset-password")
      .reply(statusCode, { message: "Password reset successfully" });
  },
};

/**
 * Mock auction API endpoints
 */
export const mockAuctionsAPI = {
  getList: (
    statusCode = 200,
    items: any[] = [],
    { page = 1, limit = 20 } = {},
  ) => {
    return nock(BASE_URL)
      .get("/auctions")
      .query({ page, limit })
      .reply(statusCode, {
        data: items,
        pagination: {
          page,
          limit,
          total: items.length,
          pages: Math.ceil(items.length / limit),
        },
      });
  },

  getDetail: (id = "auction-123", statusCode = 200, responseBody = {}) => {
    return nock(BASE_URL)
      .get(`/auctions/${id}`)
      .reply(statusCode, {
        id,
        title: "Test Auction",
        description: "Test Description",
        location: "서울특별시",
        startPrice: 100000000,
        currentBid: 150000000,
        status: "ACTIVE",
        ...responseBody,
      });
  },

  search: (
    statusCode = 200,
    items: any[] = [],
    { query = "", type = "" } = {},
  ) => {
    return nock(BASE_URL)
      .get("/auctions/search")
      .query({ q: query, type })
      .reply(statusCode, {
        data: items,
        total: items.length,
      });
  },
};

/**
 * Mock user API endpoints
 */
export const mockUsersAPI = {
  getProfile: (userId = "user-123", statusCode = 200) => {
    return nock(BASE_URL).get(`/users/${userId}`).reply(statusCode, {
      id: userId,
      email: "test@example.com",
      name: "Test User",
      avatar: "https://example.com/avatar.jpg",
      createdAt: new Date().toISOString(),
    });
  },

  updateProfile: (userId = "user-123", statusCode = 200) => {
    return nock(BASE_URL).patch(`/users/${userId}`).reply(statusCode, {
      id: userId,
      email: "test@example.com",
      name: "Updated User",
      avatar: "https://example.com/avatar.jpg",
    });
  },

  getFavorites: (userId = "user-123", statusCode = 200, items = []) => {
    return nock(BASE_URL).get(`/users/${userId}/favorites`).reply(statusCode, {
      data: items,
      total: items.length,
    });
  },

  addFavorite: (
    userId = "user-123",
    auctionId = "auction-123",
    statusCode = 201,
  ) => {
    return nock(BASE_URL)
      .post(`/users/${userId}/favorites/${auctionId}`)
      .reply(statusCode, { message: "Added to favorites" });
  },

  removeFavorite: (
    userId = "user-123",
    auctionId = "auction-123",
    statusCode = 200,
  ) => {
    return nock(BASE_URL)
      .delete(`/users/${userId}/favorites/${auctionId}`)
      .reply(statusCode, { message: "Removed from favorites" });
  },
};

/**
 * Helper to mock any GET request
 */
export const mockGet = (path: string, statusCode = 200, responseBody = {}) => {
  return nock(BASE_URL).get(path).reply(statusCode, responseBody);
};

/**
 * Helper to mock any POST request
 */
export const mockPost = (path: string, statusCode = 200, responseBody = {}) => {
  return nock(BASE_URL).post(path).reply(statusCode, responseBody);
};

/**
 * Helper to mock any request to fail
 */
export const mockNetworkError = (
  method: "get" | "post" | "put" | "patch" | "delete" = "get",
  path: string,
) => {
  const interceptor = nock(BASE_URL);
  if (method === "get") {
    return interceptor.get(path).replyWithError("Network error");
  } else if (method === "post") {
    return interceptor.post(path).replyWithError("Network error");
  } else if (method === "put") {
    return interceptor.put(path).replyWithError("Network error");
  } else if (method === "patch") {
    return interceptor.patch(path).replyWithError("Network error");
  } else if (method === "delete") {
    return interceptor.delete(path).replyWithError("Network error");
  }
};
