import * as institutionQueries from '@/lib/queries/institution-auction'

describe('Institution auction queries', () => {
  it('exports useInstitutionAuctions', () => {
    expect(typeof institutionQueries.useInstitutionAuctions).toBe('function')
  })

  it('exports useInstitutionAuctionDetail', () => {
    expect(typeof institutionQueries.useInstitutionAuctionDetail).toBe('function')
  })
})
