export function isFresh(lastScrapedAt?: Date, ttlMinutes = 1440): boolean {
  if (!lastScrapedAt) return false;
  const diff = Date.now() - new Date(lastScrapedAt).getTime();
  return diff < ttlMinutes * 60 * 1000;
}
