import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { TextInput, Button, Text, Card, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { signUp } from "../authService";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            initializeUserProfile();
            router.replace("/home");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
                <Card style={{ padding: 20, backgroundColor: theme.colors.surface }}>
                    <Text variant="titleLarge" style={{ marginBottom: 10 }}>
                        Create an Account
                    </Text>

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

                    {error && (
                        <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                            {error}
                        </Text>
                    )}

                    <Button mode="contained" onPress={handleSignUp} style={{ marginBottom: 10 }}>
                        Sign Up
                    </Button>

                    <Button mode="text" onPress={() => navigation.goBack()}>
                        Already have an account? Sign In
                    </Button>
                </Card>
            </View>
        </SafeAreaView>
    );
};

export default SignUpScreen;
