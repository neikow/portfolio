export function isSameDay(
  date1: Date | string,
  date2: Date | string,
): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  return (
    d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate()
  )
}

export function formatDate(
  date: Date | string,
  format: 'long' | 'short' = 'long',
): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions
    = format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: '2-digit', month: '2-digit', day: '2-digit' }

  return d.toLocaleDateString(undefined, options)
}
