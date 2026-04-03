import { useQuery } from '@tanstack/react-query'
import { fetchCodeDetail, fetchCodes } from '@/lib/api/codes'
import type { CodeListParams } from '@/lib/api/codes'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { queryKeys } from './keys'

export function useCodes(params: CodeListParams = {}) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.codes.list(params),
    queryFn: () => fetchCodes(params),
    enabled: isLoggedIn,
  })
}

export function useCodeDetail(id: number) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: queryKeys.codes.detail(id),
    queryFn: () => fetchCodeDetail(id),
    enabled: isLoggedIn && id > 0,
  })
}
