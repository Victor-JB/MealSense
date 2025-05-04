import React from "react";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { theme } from "../hooks/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomBackButton() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    return (
        <Button
          mode="contained"
          icon={"arrow-left"}
          textColor={theme.colors.onSurface}
          buttonColor={theme.colors.placeholder}
          onPress={() => router.back()}
          style={{
            position: "absolute",
            bottom: insets.bottom + 20,
            left: insets.left + 28,
            zIndex: 1,
          }}
        >
          Back
        </Button>
    );
}
