import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PaperProvider, useTheme } from "react-native-paper";
import { SafeAreaView, View, StatusBar, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./home";
import SettingsScreen from "./settings";
import ProfileScreen from "./profile";
import SignInScreen from "./index"; // ✅ Ensure correct import

export default function Layout() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <ThemedSafeAreaView>
          <RootNavigator />
        </ThemedSafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
}

// ✅ Create a Stack Navigator to manage authentication
const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

// ✅ Create Bottom Tab Navigator for authenticated users
const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      shifting={true}
      barStyle={{
        backgroundColor: theme.colors.surface,
        height: 65,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    >
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
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

// ✅ Themed SafeAreaView Wrapper
const ThemedSafeAreaView = ({ children }) => {
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
