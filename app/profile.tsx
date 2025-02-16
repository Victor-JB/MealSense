import React, { useState} from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text, Button, Avatar, useTheme, TextInput } from "react-native-paper";
import { logOut } from "../authService";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../useAuth";

const ProfileScreen: React.FC = () => {
    const theme = useTheme();
    const user = useAuth();
    const navigation = useNavigation(); 
    const [diningPoints, setDiningPoints] = useState(0);
  
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

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Avatar.Icon size={80} icon="account" />
                <Text variant="headlineMedium" style={{ marginTop: 20 }}>
                    {user?.email || "User"}
                </Text>

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Dining Points</Text>

                <TextInput
                    style={{
                        marginTop: 10,
                        padding: 10,
                        fontSize: 20,
                        borderWidth: 1,
                        borderColor: theme.colors.primary,
                        borderRadius: 8,
                        textAlign: "center",
                        width: 120,
                        backgroundColor: theme.colors.surface
                    }}
                    keyboardType="numeric"
                    value={diningPoints}
                    onChangeText={setDiningPoints}
                />
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
