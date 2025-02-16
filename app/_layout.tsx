import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PaperProvider, useTheme } from "react-native-paper";
import { SafeAreaView, View, StatusBar, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <PaperProvider>
      <ThemedSafeAreaView>
        <BottomTabNavigator />
      </ThemedSafeAreaView>
    </PaperProvider>
  );
}

// Create Material Bottom Tab Navigator
const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      shifting={true} // Enables smooth shifting animations
      barStyle={{
        backgroundColor: theme.colors.surface, // Matches React Native Paper theme
        height: 65, // Ensures proper height
      }}
      activeColor={theme.colors.primary} // Active icon color
      inactiveColor={theme.colors.onSurfaceVariant} // Inactive icon color
    >
      <Tab.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Themed SafeAreaView Wrapper
const ThemedSafeAreaView = ({ children }: any) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {children}
      </SafeAreaView>
    </View>
  );
};
