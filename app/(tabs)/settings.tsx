import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme, Card, Chip, Button } from "react-native-paper";
import auth, { getAuth } from '@react-native-firebase/auth';
import MealCard from "../../components/MealCard";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { theme } from "../../hooks/theme";

const SettingsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    console.log("refresh profile");
//     setRefreshing(true);
//     loadRecommendations();
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      // After this, useAuthListener (in your index.tsx) will see no user
      // and Redirect to /signin automatically.
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: false ? theme.colors.background : "#750000" }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={(
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        )}>
        <View style={{ backgroundColor: "#750000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", textAlignVertical: "center", textAlign: "center" }}>Settings</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Button mode="contained-tonal" onPress={handleSignOut}>
            Log Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
