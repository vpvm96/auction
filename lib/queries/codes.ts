import { useQuery } from '@tanstack/react-query'
import { fetchCodeDetail, fetchCodes } from '@/lib/api/codes'
import type { CodeListParams } from '@/lib/api/codes'
import { queryKeys } from './keys'

export function useCodes(params: CodeListParams = {}) {
  return useQuery({
    queryKey: queryKeys.codes.list(params),
    queryFn: () => fetchCodes(params),
  })
}

export function useCodeDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.codes.detail(id),
    queryFn: () => fetchCodeDetail(id),
    enabled: id > 0,
  })
}
