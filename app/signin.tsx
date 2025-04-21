// app/signin.tsx
import React from "react";
import { View, SafeAreaView, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import LoadingScreen from "../components/LoadingScreen";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuthListener } from "../hooks/useAuthListener";

export default function SignIn() {
  const router = useRouter();
  const { user, loading } = useAuthListener((user) => {
    router.replace("/(tabs)/home");
  });

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text variant="displayMedium" style={styles.title}>MealSense</Text>
        <Image source={require('../assets/images/MealSenseTransparent.png')} style={styles.logo} />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, justifyContent: "center", padding: 20, alignItems: "center" },
  title: { fontFamily: "Cochin", fontWeight: "bold", marginBottom: 20 },
  logo: { width: 150, height: 150, marginBottom: 20 },
  button: { marginVertical: 10, width: "80%" },
});
