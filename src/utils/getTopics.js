
export async function fetchTopics() {
    const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || "https://api.tramphim.online";
    const API_URL = `${BASE_URL}/api/phim/chu-de/`;
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const apiData = await response.json();
            const topics = apiData.map(item => ({
                ten: item.ten,
                slug: item.slug
            }));

            return topics;

        } else {
            console.warn("fetchTopics received non-OK response", response.status);
            return [];
        }
    } catch (error) {
        console.error("fetchTopics error", error);
        return [];
    }
}