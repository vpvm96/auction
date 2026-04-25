import {
  clearRecentSearchTerms,
  fetchPopularSearchTerms,
  fetchRecentSearchTerms,
  searchAuctions,
  unifiedAuctionToAuctionItem,
} from '@/lib/api/search'
import { apiClient, buildQueryString } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}))

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<typeof buildQueryString>

describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call GET /search/auctions', async () => {
    mockedBuildQueryString.mockReturnValueOnce('?keyword=test&page=1')
    mockedApiClient.mockResolvedValueOnce({
      items: [],
      page: 1,
      size: 20,
      totalCount: 0,
      totalPages: 0,
    })

    await searchAuctions({ keyword: 'test', page: 1 })

    expect(mockedApiClient).toHaveBeenCalledWith('/search/auctions?keyword=test&page=1')
  })

  it('should call GET /search/popular', async () => {
    mockedBuildQueryString.mockReturnValueOnce('?days=7&limit=10')
    mockedApiClient.mockResolvedValueOnce([])

    await fetchPopularSearchTerms({ days: 7, limit: 10 })

    expect(mockedApiClient).toHaveBeenCalledWith('/search/popular?days=7&limit=10')
  })

  it('should call GET /search/recent', async () => {
    mockedBuildQueryString.mockReturnValueOnce('?limit=5')
    mockedApiClient.mockResolvedValueOnce([])

    await fetchRecentSearchTerms({ limit: 5 })

    expect(mockedApiClient).toHaveBeenCalledWith('/search/recent?limit=5')
  })

  it('should call DELETE /search/recent', async () => {
    mockedBuildQueryString.mockReturnValueOnce('')
    mockedApiClient.mockResolvedValueOnce(undefined)

    await clearRecentSearchTerms()

    expect(mockedApiClient).toHaveBeenCalledWith(
      '/search/recent',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('should map unified item to AuctionItem', () => {
    const item = unifiedAuctionToAuctionItem({
      id: 1,
      source: 'Kamco',
      name: '테스트',
      category: '아파트',
      minBidPrice: 100,
      pbctBegnDtm: '2026-04-01T00:00:00.000Z',
      pbctClsDtm: '2026-04-10T00:00:00.000Z',
      address: '서울',
      status: '진행',
    })

    expect(item.id).toBe('1')
    expect(item.type).toBe('apartment')
    expect(item.title).toBe('테스트')
    expect(item.address).toBe('서울')
  })
})
