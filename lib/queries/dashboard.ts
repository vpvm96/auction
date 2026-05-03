import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/lib/api/dashboard'
import { useAuthGuard } from './useAuthGuard'
import { queryKeys } from './keys'

export function useDashboardSummary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => fetchDashboardSummary(),
    enabled: useAuthGuard(options?.enabled),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
