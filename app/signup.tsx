import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import LoadingScreen from "../components/LoadingScreen";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuthListener } from "../hooks/useAuthListener";

export default function SignUp() {
  const router = useRouter();
  const { user, loading } = useAuthListener((u) => {
    router.replace("/(tabs)/home");
  });

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch from firestore or hardcode in each version of app?
  const schools = ["Select your school...", "Santa Clara University", "Example College", "Example Institute"];

  if (loading) return <LoadingScreen />;

  const handleSignUp = async () => {
    if (!name || !school || school === schools[0]) {
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
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text variant="displayMedium" style={styles.title}>
          Sign Up
        </Text>

        <TextInput
          label="Full Name"
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

        <Picker
          selectedValue={school}
          onValueChange={(val) => setSchool(val)}
          style={styles.picker}
        >
          {schools.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSignUp}
          style={styles.button}
        >
          Create Account
        </Button>

        {/* Google */}
        <GoogleSignInButton />

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          style={styles.link}
        >
          Already have an account? Log In
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
  picker: { width: "80%", marginBottom: 12, backgroundColor: "#f0f0f0" },
  button: { width: "80%", marginVertical: 8 },
  link: { marginTop: 12 },
  error: { color: "red", marginBottom: 8 },
});
