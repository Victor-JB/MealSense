import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "./useAuth";
import { auth } from "./firebaseConfig";

const API_URL = "https://mealsense-api.vercel.app/"; // Replace with your actual backend URL

const defaultUserData = {
    firstName: "",
    lastName: "",
    school: "Santa Clara University",
    unit: "lbs/in",
    weight: "100",
    height: "60",
    sex: "male",
    dietaryGoals: "",
    createdAt: new Date().toISOString(),
};

/**
 * Fetches meal recommendations with caching.
 */
export const fetchRecommendation = async () => {
    try {
        const cachedData = await AsyncStorage.getItem("mealRecommendations");
        const cachedTime = await AsyncStorage.getItem("nextFetchTime");

        const now = new Date().getTime();
        if (cachedData && cachedTime && now < parseInt(cachedTime)) {
            console.log("Returning cached recommendations");
            return JSON.parse(cachedData);
        }

        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        console.log("Fetching new recommendations...");
        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_URL}/generate-recommendation/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();

        const nextFetchTime = data.nextFetchTime || now + 600000;

        await AsyncStorage.setItem("mealRecommendations", JSON.stringify(data));
        await AsyncStorage.setItem("nextFetchTime", nextFetchTime.toString());

        return data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
};

/**
 * Initializes user profile by sending default user data to FastAPI.
 */
// export const initializeUserProfile = async () => {
//     try {
//         const currentUser = auth.currentUser
//         if (!currentUser) throw new Error("User is not authenticated.");

//         const token = await currentUser.getIdToken();
//         const response = await fetch(`${API_URL}/set-user-data/`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(defaultUserData),
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to initialize user profile: ${response.status}`);
//         }

//         console.log("User profile initialized successfully.");
//     } catch (error) {
//         console.error("Error initializing user profile:", error);
//     }
// };

/**
 * Updates specific user fields by sending the update to FastAPI.
 * @param data Object containing the fields to update.
 */
export const updateUserField = async (data: Partial<Record<string, any>>) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_URL}/set-user-data/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user profile: ${response.status}`);
        }

        console.log("User profile updated successfully.");
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
};

/**
 * Retrieves the user's profile from FastAPI.
 */
export const getUserProfile = async () => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_URL}/get-user-data/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.log("FAIL:", response);
            throw new Error(`Failed to retrieve user profile: ${response.status}`);
        }

        const userData = await response.json();
        // console.log("Retrieved user profile:", userData.user_data);
        return userData.user_data;
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return defaultUserData;
    }
};
