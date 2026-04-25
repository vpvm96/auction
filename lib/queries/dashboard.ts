import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/lib/api/dashboard'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

export function useDashboardSummary(options?: { enabled?: boolean }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => fetchDashboardSummary(),
    enabled: isLoggedIn && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
