import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import LoadingScreen from "../components/LoadingScreen";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuthListener } from "../hooks/useAuthListener";

export default function Login() {
  const router = useRouter();
  const { user, loading } = useAuthListener((u) => {
    router.replace("/(tabs)/home");
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) return <LoadingScreen />;

  const handleEmailLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text variant="displayMedium" style={styles.title}>
          Login
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleEmailLogin}
          style={styles.button}
        >
          Login
        </Button>

        {/* Google */}
        <GoogleSignInButton />

        <Button
          mode="text"
          onPress={() => router.push("/signup")}
          style={styles.link}
        >
          Don't have an account? Sign Up
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { marginBottom: 20 },
  input: { width: "80%", marginBottom: 12 },
  button: { width: "80%", marginVertical: 8 },
  link: { marginTop: 12 },
  error: { color: "red", marginBottom: 8 },
});
