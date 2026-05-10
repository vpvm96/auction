import { fetchCalendarSchedules } from '@/lib/api/calendar'
import { apiClient, buildQueryString } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(),
}))

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>
const mockedBuildQueryString = buildQueryString as jest.MockedFunction<typeof buildQueryString>

describe('Calendar API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedBuildQueryString.mockReturnValue('?year=2026&month=4')
  })

  it('should call GET /calendar/schedules with query', async () => {
    mockedApiClient.mockResolvedValueOnce({
      year: 2026,
      month: 4,
      schedules: {},
    })

    await fetchCalendarSchedules({ year: 2026, month: 4 })

    expect(mockedBuildQueryString).toHaveBeenCalledWith({ year: 2026, month: 4 })
    expect(mockedApiClient).toHaveBeenCalledWith(
      '/hammers/hammer-auctions/calendar/schedules?year=2026&month=4',
    )
  })
})
