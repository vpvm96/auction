export function formatPrice(price: number): string {
  if (price >= 100000000) {
    const eok = Math.floor(price / 100000000)
    const man = Math.floor((price % 100000000) / 10000)
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`
  }
  return `${Math.floor(price / 10000).toLocaleString()}만원`
}

function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null
  const digits = dateStr.replace(/\D/g, '')
  // YYYYMMDD or YYYYMMDDHHmmss(...) — common Korean public-data format
  if (digits.length >= 8 && (dateStr.length === digits.length || !dateStr.includes('-'))) {
    const y = Number(digits.slice(0, 4))
    const m = Number(digits.slice(4, 6))
    const day = Number(digits.slice(6, 8))
    const hh = digits.length >= 10 ? Number(digits.slice(8, 10)) : 0
    const mm = digits.length >= 12 ? Number(digits.slice(10, 12)) : 0
    const ss = digits.length >= 14 ? Number(digits.slice(12, 14)) : 0
    const d = new Date(y, m - 1, day, hh, mm, ss)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatShortDate(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!d) return '-'
  return `${d.getMonth() + 1}.${d.getDate()}`
}

export function formatFullDate(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!d) return '-'
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}
