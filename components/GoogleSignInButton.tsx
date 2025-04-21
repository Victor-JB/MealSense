// components/Auth/GoogleSignInButton.tsx
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native-paper";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { GoogleAuthProvider } from '@react-native-firebase/auth';

export default function GoogleSignInButton() {
  const [error, setError] = useState("");

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '674167675472-34j4roglenjqkltscn01mli0ejdhcej8.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setError("");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <>
      <Button
        icon="google"
        mode="outlined"
        onPress={signInWithGoogle}
        style={{ marginBottom: 20, width: "80%" }}
      >
        Log in with Google
      </Button>
      {error ? <Text style={{ color: "red", marginTop: -10 }}>{error}</Text> : null}
    </>
  );
}
