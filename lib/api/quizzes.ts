import { apiClient, buildQueryString } from './client'

// ─── Response Types ──────────────────────────────────────────────────────────

export interface QuizResponse {
  id: number
  question: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface QuizAttemptResponse {
  id: number
  quizId: number | null
  selectedIndex: number
  isCorrect: boolean
  attemptedAt: string
}

// ─── Request Types ───────────────────────────────────────────────────────────

export interface SubmitQuizAttemptRequest {
  selectedIndex: number
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * 랜덤 퀴즈를 조회합니다.
 * @param count 문제 수 (기본값: 3, 최대: 10)
 */
export function fetchRandomQuizzes(count = 3): Promise<QuizResponse[]> {
  const qs = buildQueryString({ count })
  return apiClient<QuizResponse[]>(
    `/hammers/hammer-auctions/quizzes/random${qs}`,
  )
}

/**
 * 퀴즈 풀이를 제출합니다.
 * @param quizId 퀴즈 식별자
 * @param selectedIndex 선택한 보기 인덱스
 */
export function submitQuizAttempt(
  quizId: number,
  selectedIndex: number,
): Promise<QuizAttemptResponse> {
  return apiClient<QuizAttemptResponse>(
    `/hammers/hammer-auctions/quizzes/${quizId}/attempts`,
    {
      method: 'POST',
      body: JSON.stringify({ selectedIndex } satisfies SubmitQuizAttemptRequest),
    },
  )
}
