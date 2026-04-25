import * as calendarQueries from '@/lib/queries/calendar'

describe('Calendar queries', () => {
  it('exports useCalendarSchedules', () => {
    expect(typeof calendarQueries.useCalendarSchedules).toBe('function')
  })
})
