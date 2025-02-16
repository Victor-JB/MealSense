import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const API_URL = "https://your-backend-api.com/recommendations";
const defaultUserData = {
    firstName: "",
    lastName: "",
    school: "Santa Clara University",
    unit: "lbs/in",
    weight: "100",
    height: "60",
    sex: "male",
    dietaryGoals: "",
    createdAt: firestore.FieldValue.serverTimestamp(),
};

export const fetchRecommendation = async () => {
    try {
        const cachedData = await AsyncStorage.getItem("mealRecommendations");
        const cachedTime = await AsyncStorage.getItem("nextFetchTime");

        const now = new Date().getTime();
        if (cachedData && cachedTime && now < parseInt(cachedTime)) {
            console.log("Returning cached recommendations");
            return JSON.parse(cachedData);
        }

        console.log("Fetching new recommendations...");
        const response = await fetch(API_URL);
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

export const initializeUserProfile = async () => {
    try {
        const currentUser = auth().currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        const userId = currentUser.uid;
        const userRef = firestore().collection("users").doc(userId);

        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set(defaultUserData);
            console.log("User profile initialized successfully.");
        } else {
            console.log("User profile already exists.");
        }
    } catch (error) {
        console.error("Error initializing user profile:", error);
    }
};

/**
 * Updates a user's profile fields in Firestore.
 * @param data Object containing the fields to update.
 */
export const updateUserField = async (data: Partial<Record<string, any>>) => {
    try {
        const currentUser = auth().currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        const userId = currentUser.uid;
        const userRef = firestore().collection("users").doc(userId);

        await userRef.update(data);
        console.log("User profile updated successfully.");
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
};

/**
 * Retrieves the user's profile from Firestore.
 */
export const getUserProfile = async () => {
    try {
        const currentUser = auth().currentUser;
        if (!currentUser) throw new Error("User is not authenticated.");

        const userId = currentUser.uid;
        const userRef = firestore().collection("users").doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
            const userData = doc.data();
            console.log("Retrieved user profile:", userData);
            return userData;
        } else {
            console.warn("User profile not found.");
            return defaultUserData;
        }
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return defaultUserData;
    }
};
