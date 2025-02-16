import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PaperProvider, MD3DarkTheme as defaultDark, useTheme, Card, Chip } from "react-native-paper";
import { SafeAreaView, View, StatusBar, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./home";
import SettingsScreen from "./settings";
import ProfileScreen from "./profile";
import SignInScreen from "./index";
import SignUpScreen from "./sign-up";

export default function Layout() {

  const customTheme = {
    ...defaultDark,
    colors: {
      ...defaultDark.colors, // override by defining our own below
      "primary": "rgb(175, 47, 33)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(255, 218, 212)",
      "onPrimaryContainer": "rgb(65, 0, 0)",
      "secondary": "rgb(119, 86, 81)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(255, 218, 212)",
      "onSecondaryContainer": "rgb(44, 21, 18)",
      "tertiary": "rgb(152, 64, 97)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(255, 217, 226)",
      "onTertiaryContainer": "rgb(62, 0, 29)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(255, 251, 255)",
      "onBackground": "rgb(32, 26, 25)",
      "surface": "rgb(255, 251, 255)",
      "onSurface": "rgb(32, 26, 25)",
      "surfaceVariant": "rgb(245, 221, 218)",
      "onSurfaceVariant": "rgb(83, 67, 65)",
      "outline": "rgb(133, 115, 112)",
      "outlineVariant": "rgb(216, 194, 190)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(54, 47, 46)",
      "inverseOnSurface": "rgb(251, 238, 236)",
      "inversePrimary": "rgb(255, 180, 168)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(251, 241, 244)",
        "level2": "rgb(249, 235, 237)",
        "level3": "rgb(246, 229, 231)",
        "level4": "rgb(245, 227, 228)",
        "level5": "rgb(244, 222, 224)"
      },
      "surfaceDisabled": "rgba(32, 26, 25, 0.12)",
      "onSurfaceDisabled": "rgba(32, 26, 25, 0.38)",
      "backdrop": "rgba(59, 45, 43, 0.4)"
    }
  }

  return (
    <PaperProvider theme = {customTheme} >
        <ThemedSafeAreaView>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ThemedSafeAreaView>
    </PaperProvider>
  );
}

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="home"
      shifting={true}
      barStyle={{
        backgroundColor: theme.colors.surface,
        height: 65
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

const ThemedSafeAreaView = ({ children }) => {
  const theme = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#750000" || theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar
        translucent
        backgroundColor="#750000" 
        barStyle="light-content" 
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#750000" || theme.colors.background }}>
        {children}
      </SafeAreaView>
    </View>
  );
};
