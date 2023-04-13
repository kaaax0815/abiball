export function dateToUnix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/** 13.04.2023 */
export const DD_MM_YYYY = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
} satisfies Intl.DateTimeFormatOptions;

export function formatIso(iso: string, style: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('de-DE', style).format(new Date(iso));
}
