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

/** 퀴즈 일괄 풀이 제출 결과 (총 문항·정답 수·문항별 채점). */
export interface SubmitQuizAttemptsResponse {
  total: number
  correct: number
  attempts: QuizAttemptResponse[]
}

// ─── Request Types ───────────────────────────────────────────────────────────

export interface SubmitQuizAttemptRequest {
  selectedIndex: number
}

/** 일괄 제출에 포함되는 개별 퀴즈 풀이 항목. */
export interface QuizAttemptSubmission {
  quizId: number
  selectedIndex: number
}

export interface SubmitQuizAttemptsRequest {
  attempts: QuizAttemptSubmission[]
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

/**
 * 한 세트의 퀴즈 풀이를 일괄 제출합니다.
 * @param attempts 문항별 풀이 목록 (quizId, 선택한 보기 인덱스)
 */
export function submitQuizAttempts(
  attempts: QuizAttemptSubmission[],
): Promise<SubmitQuizAttemptsResponse> {
  return apiClient<SubmitQuizAttemptsResponse>(
    '/hammers/hammer-auctions/v2/quizzes/attempts',
    {
      method: 'POST',
      body: JSON.stringify({ attempts } satisfies SubmitQuizAttemptsRequest),
    },
  )
}
