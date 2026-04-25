import * as searchQueries from '@/lib/queries/search'

describe('Search queries', () => {
  it('exports useUnifiedSearchAuctions', () => {
    expect(typeof searchQueries.useUnifiedSearchAuctions).toBe('function')
  })

  it('exports usePopularSearchTerms', () => {
    expect(typeof searchQueries.usePopularSearchTerms).toBe('function')
  })

  it('exports useRecentSearchTerms', () => {
    expect(typeof searchQueries.useRecentSearchTerms).toBe('function')
  })
})
