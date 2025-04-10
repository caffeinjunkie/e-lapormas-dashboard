import { fetchGeneralStatistics, fetchLocationStatistics, fetchCategoryStatistics } from "@/api/statistics";

export const getData = async () => {
  try {
    const data = await fetchGeneralStatistics();
    const locationData = await fetchLocationStatistics();
    const categoryData = await fetchCategoryStatistics();

    return { data, locationData, categoryData };
  } catch (error) {
    console.error("Error fetching statistics data:", error);
    return { data: [], locationData: [], categoryData: [] };
  }
};