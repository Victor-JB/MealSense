import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Button, Avatar, useTheme, TextInput, Card, Chip } from "react-native-paper";
import { logOut } from "../authService";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { updateUserField, getUserProfile, getUserOrderHistory } from "../mainService";
import useAuth from "../useAuth";
import { useUserProfile } from "./mainContext";
import { getTagColor } from "../MealCard";

const ProfileScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation(); 
    const { userProfile, setUserProfile } = useUserProfile();
    const [firstName, setFirstName] = useState(userProfile?.firstName || "Loading");
    const [lastName, setLastName] = useState(userProfile?.lastName || "User");
    const [diningPoints, setDiningPoints] = useState(userProfile?.diningPoints || "2500");
    const [orderHistory, setOrderHistory] = useState([]);
  
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const updatedProfile = await getUserProfile();
                if (updatedProfile) {
                    setUserProfile(updatedProfile);
                    setFirstName(updatedProfile.firstName || "Loading");
                    setLastName(updatedProfile.lastName || "User");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchOrderHistory = async () => {
            try {
                const history = await getUserOrderHistory();
                setOrderHistory(history?.reverse() || []);
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        };

        fetchProfile();
        fetchOrderHistory();
    }, [userProfile]);

    useEffect(() => {
        if (userProfile) {
            setFirstName(userProfile.firstName || "Loading");
            setLastName(userProfile.lastName || "User");
        }
    }, [userProfile]);

    const handleLogout = async () => {
      await logOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }], 
      });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TouchableOpacity
                style={{ position: "absolute", top: 20, right: 20 }}
                onPress={handleLogout}
            >
                <Avatar.Icon size={36} icon="logout" style={{ backgroundColor: theme.colors.primary }} />
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: 60 }}>
                <Avatar.Icon size={80} icon="account" />
                <Text variant="headlineMedium" style={{ marginTop: 10 }}>
                    {firstName} {lastName}
                </Text>

                <Text variant="titleMedium" style={{ marginTop: 30 }}>Dining Points</Text>

                <TextInput
                    style={{
                        marginTop: 10,
                        padding: 10,
                        borderWidth: 0,
                        fontWeight: "bold",
                        borderColor: theme.colors.primary,
                        borderRadius: 8,
                        textAlign: "center",
                        width: 120,
                        backgroundColor: theme.colors.surface
                    }}
                    contentStyle={{
                        fontSize: 28,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                    keyboardType="numeric"
                    value={diningPoints}
                    onChangeText={(v) => {
                        setDiningPoints(v);
                        const newData = {
                            diningPoints: v,
                        };
                        updateUserField(newData);
                        setUserProfile(newData);
                    }}
                />
            </View>

            {/* Purchase History */}
            <Text variant="titleMedium" style={{ marginTop: 30, marginLeft: 20 }}>Order History</Text>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 10 }}>
                {orderHistory.length > 0 ? orderHistory.map((order, index) => (
                    <Card key={index} style={{ marginBottom: 15, padding: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{order.name}</Text>
                        <Text style={{ color: "gray", fontSize: 14 }}>Ordered: {order.timestamp}</Text>
                        {order.modifications && (
                            <Text style={{ color: "gray", fontSize: 14 }}>Modifications: {order.modifications}</Text>
                        )}
                        {order.reason && (
                            <Text style={{ color: "gray", fontSize: 14 }}>Reason: {order.reason}</Text>
                        )}
                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                            {order.tags.map((tag, i) => (
                                <Chip key={i} style={{ marginRight: 5 }}>{tag}</Chip>
                            ))}
                        </View>
                    </Card>
                )) : (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>No purchases yet.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
