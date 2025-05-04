import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import LoadingScreen from "../components/LoadingScreen";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuthListener } from "../hooks/useAuthListener";
import BottomBackButton from "../components/BottomBackButton";
import { Dropdown } from "react-native-paper-dropdown";
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from "../hooks/theme";

export default function SignUp() {
  const router = useRouter();
  const { user, loading } = useAuthListener((u) => {
    router.replace("/(tabs)/home");
  });

  const [name, setName] = useState<string|undefined>(undefined);
  const [school, setSchool] = useState<string|undefined>(undefined);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  // Fetch from firestore or hardcode in each version of app?
  const SCHOOL_OPTIONS = [
    { label: "Santa Clara University", value: "Santa Clara University" },
    { label: "Example College", value: "Example College" },
    { label: "Example Institute", value: "Example Institute" },
  ];

  if (loading) return <LoadingScreen />;

  const handleSignUp = async () => {
    if (!name || !school) {
      setError("Please fill out all fields");
      return;
    }
    try {
      const cred = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      // update displayName
      await cred.user.updateProfile({ displayName: name });
      // TODO: persist `school` in Firestore under user.uid
      setError("");
    } catch (err: any) {
      let friendly: string;
      switch (err.code) {
        case "auth/email-already-in-use":
          friendly =
            "That email is already registered. Try logging in or use a different email.";
          break;
        case "auth/invalid-email":
          friendly = "Oops—that doesn’t look like a valid email address.";
          break;
        case "auth/weak-password":
          friendly = "Your password is too weak. Try something longer.";
          break;
        // …add any other codes you care about…
        default:
          friendly =
            "Something went wrong. Please check your details and try again.";
      }
      setError(friendly);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding" // or "position" on Android
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="displayMedium" style={styles.title}>
            Sign Up
          </Text>

          <View style={{ width: '80%', marginBottom: 12, alignSelf: 'center' }}>
            <Dropdown
              label="Schools"
              placeholder="Select School…"
              options={SCHOOL_OPTIONS}
              value={school}
              onSelect={setSchool}
            />
          </View>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
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
            onPress={handleSignUp}
            style={styles.button}
          >
            Create Account
          </Button>

          <GoogleSignInButton />

          <Button
            mode="text"
            onPress={() => router.push("/login")}
            style={styles.link}
          >
            Already have an account? Log In
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBackButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { marginBottom: 20, fontWeight: "bold" },
  input: { width: "80%", marginBottom: 12 },
  picker: { width: "80%", marginBottom: 12, backgroundColor: "#f0f0f0" },
  button: { width: "80%", marginVertical: 8 },
  link: { marginTop: 12 },
  error: { color: "red", marginBottom: 8 },
});