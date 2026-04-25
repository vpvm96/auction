import { useQuery } from '@tanstack/react-query'
import { fetchCalendarSchedules } from '@/lib/api/calendar'
import type { CalendarScheduleParams } from '@/lib/api/calendar'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

export function useCalendarSchedules(
  params: CalendarScheduleParams = {},
  options?: { enabled?: boolean },
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.calendar.schedules(params),
    queryFn: () => fetchCalendarSchedules(params),
    enabled: isLoggedIn && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
