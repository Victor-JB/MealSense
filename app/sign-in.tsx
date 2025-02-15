import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { router } from "expo-router";
import { signIn } from "../authService";

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace("/home");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Card style={{ padding: 20 }}>
        <Text variant="titleLarge">Welcome Back</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <Button mode="contained" onPress={handleSignIn} style={{ marginTop: 10 }}>
          Sign In
        </Button>
        <Button mode="text" onPress={() => router.replace("/sign-up")}>
          Don't have an account? Sign Up
        </Button>
      </Card>
    </View>
  );
};

export default SignInScreen;
