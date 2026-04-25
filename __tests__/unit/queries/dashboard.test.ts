import * as dashboardQueries from '@/lib/queries/dashboard'

describe('Dashboard queries', () => {
  it('exports useDashboardSummary', () => {
    expect(typeof dashboardQueries.useDashboardSummary).toBe('function')
  })
})
