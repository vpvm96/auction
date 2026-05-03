import { useQuery } from '@tanstack/react-query'
import { fetchCalendarSchedules } from '@/lib/api/calendar'
import type { CalendarScheduleParams } from '@/lib/api/calendar'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useCalendarSchedules(
  params: CalendarScheduleParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.calendar.schedules(params),
    queryFn: () => fetchCalendarSchedules(params),
    enabled: useAuthGuard(options?.enabled),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
