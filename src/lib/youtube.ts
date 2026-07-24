/** Builds a YouTube search URL filtered to Shorts-length results for the given phrase. */
export function shortsSearchUrl(query: string): string {
  const params = new URLSearchParams({
    search_query: query,
    sp: 'EgIYAQ==',
  })
  return `https://www.youtube.com/results?${params.toString()}`
}
