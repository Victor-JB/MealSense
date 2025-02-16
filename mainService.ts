import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const API_URL = "https://your-backend-api.com/recommendations";

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

        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }

        const userId = currentUser.uid;

        const userRef = firestore().collection('users').doc(userId);

        const defaultUserData = {
            weight: null,
            height: null,
            sex: null,
            dietary_goals: {
                low_sodium: false,
                high_protein: false,
                vegan: false,
            },
            created_at: firestore.FieldValue.serverTimestamp(),
        };

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

export const updateUserField = async (data: any) => {
    try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
            throw new Error("User is not authenticated.");
        }

        const userId = currentUser.uid;

        const userRef = firestore().collection('users').doc(userId);

        await userRef.update(data);

        console.log(`Successfully updated`);
    } catch (error) {
        console.error("Error updating user field:", error);
    }
};
