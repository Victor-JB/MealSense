import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://your-backend-api.com/recommendations"; // Replace with your actual API URL

export const fetchRecommendation = async () => {
  try {
    // 1️⃣ Retrieve cached data
    const cachedData = await AsyncStorage.getItem("mealRecommendations");
    const cachedTime = await AsyncStorage.getItem("nextFetchTime");

    // 2️⃣ Check if the next fetch time has passed
    const now = new Date().getTime();
    if (cachedData && cachedTime && now < parseInt(cachedTime)) {
      console.log("Returning cached recommendations");
      return JSON.parse(cachedData); // Return cached data
    }

    // 3️⃣ Fetch new recommendations from API
    console.log("Fetching new recommendations...");
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch recommendations");

    const data = await response.json();

    // 4️⃣ Extract `nextFetchTime` from response
    const nextFetchTime = data.nextFetchTime || now + 600000; // Default: 10 min later if missing

    // 5️⃣ Cache new recommendations & next fetch time
    await AsyncStorage.setItem("mealRecommendations", JSON.stringify(data));
    await AsyncStorage.setItem("nextFetchTime", nextFetchTime.toString());

    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error; // Propagate error so UI can handle it
  }
};
