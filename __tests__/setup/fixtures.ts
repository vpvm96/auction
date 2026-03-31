/**
 * Test Data Fixtures
 * Reusable test data for unit, integration, and E2E tests
 */

/**
 * User fixtures
 */
export const mockUsers = {
  default: {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    avatar: "https://example.com/avatar.jpg",
    createdAt: "2024-01-01T00:00:00Z",
  },
  admin: {
    id: "user-admin",
    email: "admin@example.com",
    name: "Admin User",
    avatar: "https://example.com/avatar-admin.jpg",
    createdAt: "2023-01-01T00:00:00Z",
  },
};

/**
 * Auth fixtures
 */
export const mockAuthResponse = {
  token: "test-token-12345",
  refreshToken: "test-refresh-token-12345",
  user: mockUsers.default,
  expiresIn: 3600,
};

/**
 * Auction fixtures
 */
export const mockAuctions = {
  default: {
    id: "auction-123",
    title: "광화문 오피스텔",
    description: "서울 중심부의 프리미엄 오피스텔",
    location: "서울특별시 종로구 광화문로 1",
    region: "서울",
    district: "종로구",
    price: 2500000000, // 25억
    startPrice: 2000000000, // 20억
    currentBid: 2300000000, // 23억
    highestBidder: "user-456",
    status: "ACTIVE", // ACTIVE, CLOSED, PENDING, CANCELLED
    type: "APARTMENT", // APARTMENT, OFFICE, LAND, etc.
    imageUrl: "https://example.com/auction-123.jpg",
    images: [
      "https://example.com/auction-123-1.jpg",
      "https://example.com/auction-123-2.jpg",
    ],
    biddingRate: 75, // percentage
    firstAuction: true,
    totalLots: 1,
    auctionStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    auctionEndDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 7 days
    createdAt: "2024-01-01T00:00:00Z",
  },
  closed: {
    id: "auction-closed",
    title: "종로구 주택",
    description: "사직동의 한옥",
    location: "서울특별시 종로구 사직로 10",
    region: "서울",
    district: "종로구",
    price: 1500000000,
    startPrice: 1200000000,
    currentBid: 1450000000,
    status: "CLOSED",
    type: "HOUSE",
    imageUrl: "https://example.com/auction-closed.jpg",
    images: [],
    biddingRate: 50,
    firstAuction: false,
    totalLots: 1,
    auctionStartDate: "2023-12-01T00:00:00Z",
    auctionEndDate: "2023-12-08T00:00:00Z",
    createdAt: "2023-11-01T00:00:00Z",
  },
  pending: {
    id: "auction-pending",
    title: "강남구 상가",
    description: "강남역 인근 상가건물",
    location: "서울특별시 강남구 테헤란로 123",
    region: "서울",
    district: "강남구",
    price: 5000000000,
    startPrice: 4500000000,
    currentBid: 4500000000,
    status: "PENDING",
    type: "COMMERCIAL",
    imageUrl: "https://example.com/auction-pending.jpg",
    images: [],
    biddingRate: 0,
    firstAuction: true,
    totalLots: 1,
    auctionStartDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    auctionEndDate: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    createdAt: "2024-01-15T00:00:00Z",
  },
};

export const mockAuctionsList = [
  mockAuctions.default,
  mockAuctions.closed,
  mockAuctions.pending,
];

/**
 * Search query fixtures
 */
export const mockSearchQueries = {
  default: {
    q: "오피스텔",
    type: "APARTMENT",
    region: "서울",
    priceMin: 1000000000,
    priceMax: 5000000000,
    status: "ACTIVE",
    page: 1,
    limit: 20,
  },
};

/**
 * Category fixtures
 */
export const mockCategories = [
  { id: "apt", name: "아파트", icon: "home", count: 125 },
  { id: "office", name: "오피스", icon: "briefcase", count: 45 },
  { id: "land", name: "토지", icon: "map", count: 78 },
  { id: "commercial", name: "상가", icon: "shopping-building", count: 32 },
];

/**
 * Region fixtures
 */
export const mockRegions = [
  { id: "seoul", name: "서울", count: 280 },
  { id: "gyeonggi", name: "경기", count: 156 },
  { id: "incheon", name: "인천", count: 89 },
  { id: "busan", name: "부산", count: 145 },
];

/**
 * Notification fixtures
 */
export const mockNotifications = {
  auction: {
    id: "notif-1",
    type: "AUCTION_OUTBID",
    title: "입찰 초과",
    message: "광화문 오피스텔 경매에서 누군가 당신의 입찰가를 초과했습니다",
    auctionId: "auction-123",
    read: false,
    createdAt: new Date().toISOString(),
  },
  reminder: {
    id: "notif-2",
    type: "AUCTION_REMINDER",
    title: "경매 곧 종료",
    message: "종로구 주택의 경매가 24시간 후 종료됩니다",
    auctionId: "auction-closed",
    read: false,
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  saved: {
    id: "notif-3",
    type: "FAVORITE_NEW",
    title: "찜한 물건 업데이트",
    message: "강남 상가 경매 리스트에 새로운 물건이 추가되었습니다",
    auctionId: "auction-pending",
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
};

/**
 * Form data fixtures
 */
export const mockFormData = {
  loginValid: {
    email: "test@example.com",
    password: "ValidPassword123!",
  },
  loginInvalid: {
    email: "invalid-email",
    password: "weak",
  },
  signupValid: {
    name: "Test User",
    email: "newuser@example.com",
    password: "ValidPassword123!",
    passwordConfirm: "ValidPassword123!",
    agreeTerms: true,
  },
  signupInvalid: {
    name: "",
    email: "invalid",
    password: "weak",
    passwordConfirm: "different",
    agreeTerms: false,
  },
};

/**
 * API Response fixtures
 */
export const mockApiResponses = {
  successList: {
    data: mockAuctionsList,
    pagination: {
      page: 1,
      limit: 20,
      total: 3,
      pages: 1,
    },
  },
  successDetail: {
    data: mockAuctions.default,
  },
  errorNotFound: {
    error: {
      code: "NOT_FOUND",
      message: "Auction not found",
      statusCode: 404,
    },
  },
  errorUnauthorized: {
    error: {
      code: "UNAUTHORIZED",
      message: "Unauthorized access",
      statusCode: 401,
    },
  },
  errorServerError: {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      statusCode: 500,
    },
  },
};

/**
 * Pagination fixtures
 */
export const mockPagination = {
  page1: { page: 1, limit: 20, total: 100, pages: 5 },
  page2: { page: 2, limit: 20, total: 100, pages: 5 },
  empty: { page: 1, limit: 20, total: 0, pages: 0 },
};

/**
 * Filter fixtures
 */
export const mockFilters = {
  byPrice: { minPrice: 1000000000, maxPrice: 3000000000 },
  byRegion: { region: "seoul", district: "강남구" },
  byStatus: { status: "ACTIVE" },
  byType: { type: "APARTMENT" },
  combined: {
    region: "seoul",
    minPrice: 2000000000,
    maxPrice: 5000000000,
    status: "ACTIVE",
  },
};
