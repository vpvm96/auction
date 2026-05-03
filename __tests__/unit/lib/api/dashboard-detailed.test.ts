import {
  dashboardSummaryToAuctionStats,
  fetchDashboardSummary,
} from '@/lib/api/dashboard'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: jest.fn(),
}))

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>

describe('Dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call GET /dashboard/summary', async () => {
    mockedApiClient.mockResolvedValueOnce({ categories: [] })

    await fetchDashboardSummary()

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/hammers/hammer-auctions/dashboard/summary',
    )
  })

  it('should bucket categories into real estate vs vehicle', () => {
    const stats = dashboardSummaryToAuctionStats({
      categories: [
        { category: '아파트', totalCount: 100, dailyChange: 5 },
        { category: '자동차', totalCount: 20, dailyChange: -2 },
      ],
    })

    expect(stats.realEstate.count).toBe(100)
    expect(stats.realEstate.change).toBe(5)
    expect(stats.personal.count).toBe(20)
    expect(stats.personal.change).toBe(-2)
  })
})
