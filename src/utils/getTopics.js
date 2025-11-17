
export async function fetchTopics() {
    const API_URL = 'http://127.0.0.1:8000/api/phim/chu-de/';
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
            return [];
        }
    } catch (error) {
        return [];
    }
}