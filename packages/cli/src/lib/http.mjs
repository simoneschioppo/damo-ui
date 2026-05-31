/** Thin fetch wrapper with clear errors — kept out of registry.mjs so that
 * module stays pure and unit-testable with an injected fetcher. */

/**
 * GET a URL and parse JSON, throwing a readable error on failure.
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function fetchJson(url) {
  let res
  try {
    res = await fetch(url, { headers: { accept: 'application/json' } })
  } catch (err) {
    throw new Error(`Network error fetching ${url}: ${err.message}`)
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`)
  }
  try {
    return await res.json()
  } catch {
    throw new Error(`Response from ${url} was not valid JSON`)
  }
}
