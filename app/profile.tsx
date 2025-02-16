import React from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text, Button, Avatar, useTheme } from "react-native-paper";
import { logOut } from "../authService";
import { router } from "expo-router";
import useAuth from "../useAuth";

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const user = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Log Out Button in Top Right */}
      <TouchableOpacity 
        style={{ position: "absolute", top: 20, right: 20 }}
        onPress={() => {
          logOut();
          router.replace("./index");
        }}
      >
        <Avatar.Icon size={36} icon="logout" style={{ backgroundColor: theme.colors.primary }} />
      </TouchableOpacity>

      {/* Profile Content */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Avatar.Icon size={80} icon="account" />
        <Text variant="headlineMedium" style={{ marginTop: 20 }}>
          {user?.email || "User"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
