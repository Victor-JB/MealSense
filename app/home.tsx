import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import useAuth from "../useAuth";

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const user = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Text variant="headlineMedium">
          Hello, {user?.email || "User"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
