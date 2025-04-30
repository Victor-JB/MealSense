// app/signin.tsx
import React from "react";
import { View, SafeAreaView, StyleSheet, Image, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import LoadingScreen from "../components/LoadingScreen";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuthListener } from "../hooks/useAuthListener";
import { LinearGradient } from "expo-linear-gradient"

const { width: screenWidth } = Dimensions.get("window");

export default function SignIn() {
  const router = useRouter();
  const { user, loading } = useAuthListener((user) => {
    router.replace("/(tabs)/home");
  });

  if (loading) return <LoadingScreen />;

  return (
    <LinearGradient
      // first color is at the top, second is at the bottom
      colors={['#228B22', '#333333']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.inner}>
          <Text variant="displayMedium" style={styles.title}>MealSense</Text>
          
          <View style={styles.verticalContainer}>
            <Image source={require('../assets/images/MealSenseTransparent.png')} style={styles.logo} />
            <Text style={styles.subtitle}>
              Nutrition without Decision
            </Text>
            <Text style={styles.label}>
              Join others in eating healthier and happier today!
            </Text>
          </View>

          <View style={styles.verticalContainer}>
            <Button
              mode="text"
              style={styles.button}
              onPress={() => router.push("/login")}
            >
              I already have an account
            </Button>

            <Button
              mode="contained"
              style={styles.button}
              onPress={() => router.replace("/signup")}
            >
              Eat Sensibly →
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingVertical: 50,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginTop: 30,
    color: "white",
  },
  verticalContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    height: screenWidth * 0.55,
    aspectRatio: 1,
    marginBottom: 0,
  },
  button: {
    marginVertical: 10,
    width: "80%",
  },
  subtitle: {
    fontSize: 24,
    color: "white",
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
});