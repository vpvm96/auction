import { useAuthStore } from '@/lib/store/useAuthStore'

/**
 * 쿼리 활성화를 로그인 상태와 묶는 가드.
 * `useQuery`/`useInfiniteQuery`의 `enabled` 옵션으로 사용한다.
 *
 *   enabled: useAuthGuard(options?.enabled)
 *
 * - 비로그인이면 항상 false
 * - 로그인 + enabled !== false 일 때만 true (undefined도 통과)
 */
export function useAuthGuard(enabled?: boolean): boolean {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return isLoggedIn && enabled !== false
}
