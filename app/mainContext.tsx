import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../mainService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({ firstName: "User" });
    const [authChecked, setAuthChecked] = useState(false); // Track if auth state is checked

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("✅ User authenticated:", user.email);
                try {
                    const profile = await getUserProfile();
                    setUserProfile(profile);
                } catch (error) {
                    console.error("⚠️ Error fetching profile:", error);
                }
            } else {
                console.log("🚨 No authenticated user found.");
                setUserProfile({ firstName: "User" });
            }
            setAuthChecked(true); // ✅ Auth state is checked
        });

        return () => unsubscribe();
    }, []);

    if (!authChecked) {
        return null; // 🚀 Prevents rendering children before auth state is known
    }

    return (
        <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => useContext(UserProfileContext);

export default UserProfileContext;
