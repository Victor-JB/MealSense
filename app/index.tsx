import React, { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { TextInput, Button, Text, Card, useTheme, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

export default function Index() {
  const theme = useTheme();
  const navigation = useNavigation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //       // initializeUserProfile();
  //       navigation.navigate("Main"); 
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Card style={{ padding: 20, backgroundColor: theme.colors.surface }}>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>Welcome Back</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            style={{ backgroundColor: theme.colors.surface, marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={{ backgroundColor: theme.colors.surface, marginBottom: 10 }}
          />
          {error && <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{error}</Text>}
          <Button mode="contained" /* onPress={handleSignIn} */ style={{ marginBottom: 10 }}> 
            Sign In
          </Button>
          <Button mode="text" /* onPress={() => navigation.navigate("SignUp")} */ >
            Don't have an account? Sign Up
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
}
