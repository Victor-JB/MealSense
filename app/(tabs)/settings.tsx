import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme, Card, Chip } from "react-native-paper";
import auth, { getAuth } from '@react-native-firebase/auth';
import MealCard from "../../components/MealCard";


const SettingsScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    console.log("refresh profile");
//     setRefreshing(true);
//     loadRecommendations();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: false ? theme.colors.background : "#750000" }}
      refreshControl={(
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
      )}>
      <View style={{ backgroundColor: "#750000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", textAlignVertical: "center", textAlign: "center" }}>Settings</Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
