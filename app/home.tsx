import React from "react";
import { View } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { logOut } from "../authService";
import useAuth from "../useAuth";

const HomeScreen: React.FC = () => {
  const user = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Card style={{ padding: 20 }}>
        <Text variant="titleLarge">Welcome, {user?.email || "User"}!</Text>
        <Button mode="contained" onPress={() => { logOut(); router.replace("/sign-in"); }} style={{ marginTop: 10 }}>
          Log Out
        </Button>
      </Card>
    </View>
  );
};

export default HomeScreen;