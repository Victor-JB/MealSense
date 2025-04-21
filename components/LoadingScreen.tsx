import React from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

export default function LoadingScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </SafeAreaView>
  );
}
