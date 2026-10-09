const API_BASE_URL = '/api';

export const getHomeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/home`);

    if (!response.ok) {
      throw new Error('Failed to load home page data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Home data fetch error:', error);
    return null;
  }
};
