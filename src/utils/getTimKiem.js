// Ensure HTTPS in production and provide fallback
const getBaseUrl = () => {
  let url = import.meta.env.PUBLIC_API_BASE_URL || 'https://api.tramphim.com';
  // Force HTTPS in production (when not localhost)
  if (url && !url.includes('localhost') && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
};
export const BASE_URL = getBaseUrl();

/**
 * Fetches JSON data from a given URL.
 * @param {string} url The URL to fetch.
 * @returns {Promise<object|null>} The JSON data or null on error.
 */
const fetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error fetching from URL: ${url}. Status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Fetch error for URL: ${url}`, err);
    return null;
  }
};

/**
 * Searches for movies based on a keyword.
 * @param {string} keyword The search keyword.
 * @returns {Promise<Array>} An array of movies or an empty array on error.
 */
export const searchMovies = async (keyword) => {
  if (!keyword) return [];
  try {
    const searchApiUrl = `${BASE_URL}/api/search/?q=${encodeURIComponent(keyword)}`;
    const searchData = await fetchJson(searchApiUrl);
    return searchData || [];
  } catch (err) {
    console.error("Error calling search API:", err);
    return [];
  }
};

/**
 * Fetches the top movies.
 * @param {number} [limit=10] The number of top movies to fetch.
 * @returns {Promise<Array>} An array of top movies or an empty array on error.
 */
export const getTopMovies = async (limit = 10) => {
  const TOP_URL = `${BASE_URL}/api/filter/?page=1&limit=${limit}&sort=luot-xem`;
  const topResponse = await fetchJson(TOP_URL);
  return topResponse?.data || [];
};
