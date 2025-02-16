import React, { useState } from "react";
import { ScrollView, SafeAreaView, View, Pressable, Animated } from "react-native";
import { TextInput, Button, Text, SegmentedButtons, useTheme } from "react-native-paper";

const SettingsScreen: React.FC = () => {
    const theme = useTheme(); // Get theme colors
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [sex, setSex] = useState<"male" | "female">("male");
    const [additionalInfo, setAdditionalInfo] = useState("");

    // Animated value for smooth transition
    const toggleAnim = new Animated.Value(sex === "male" ? 0 : 1);

    const toggleSex = () => {
        const newSex = sex === "male" ? "female" : "male";
        setSex(newSex);
        Animated.timing(toggleAnim, {
            toValue: newSex === "male" ? 0 : 1,
            duration: 200, // Animation duration
            useNativeDriver: false
        }).start();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text variant="titleLarge">Settings</Text>

                {/* Unit Selector */}
                <Text variant="titleMedium" style={{ marginTop: 20 }}>Units</Text>
                <SegmentedButtons
                    value={unit}
                    onValueChange={(value) => setUnit(value as "metric" | "imperial")}
                    buttons={[
                        { value: "metric", label: "Metric (kg/cm)" },
                        { value: "imperial", label: "Imperial (lb/in)" }
                    ]}
                />

                {/* Height Input */}
                <Text variant="titleMedium" style={{ marginTop: 20 }}>Height ({unit === "metric" ? "cm" : "in"})</Text>
                <TextInput
                    label={`Height (${unit === "metric" ? "cm" : "in"})`}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    mode="outlined"
                    style={{ backgroundColor: theme.colors.surface }}
                />

                {/* Weight Input */}
                <Text variant="titleMedium" style={{ marginTop: 20 }}>Weight ({unit === "metric" ? "kg" : "lb"})</Text>
                <TextInput
                    label={`Weight (${unit === "metric" ? "kg" : "lb"})`}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    mode="outlined"
                    style={{ backgroundColor: theme.colors.surface }}
                />
                
                {/* Custom Sex Toggle */}
                <Text variant="titleMedium" style={{ marginTop: 20 }}>Sex</Text>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, width: "100%" }}>
                    {/* Left-aligned Male Text with Fixed Width */}
                    <Text 
                        variant="bodyLarge" 
                        style={{ 
                            fontWeight: sex === "male" ? "bold" : "normal", 
                            color: sex === "male" ? "skyblue" : "black",
                            minWidth: 65, // Allows space for both words, prevents wrapping
                            textAlign: "center" // Keeps text centered
                        }}
                    >
                        Male
                    </Text>

                    {/* Toggle in Center */}
                    <Pressable 
                        onPress={toggleSex} 
                        style={{
                            width: 60, 
                            height: 30, 
                            borderRadius: 15, 
                            backgroundColor: sex === "male" ? "skyblue" : "pink", 
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 2
                        }}
                    >
                        <Animated.View
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                backgroundColor: "white",
                                position: "absolute",
                                left: 2, // Adjusted for centering
                                transform: [{
                                    translateX: toggleAnim.interpolate({
                                        inputRange: [0, 1], 
                                        outputRange: [0, 30] // Fine-tuned for perfect centering
                                    })
                                }]
                            }}
                        />
                    </Pressable>

                    {/* Right-aligned Female Text with Fixed Width */}
                    <Text 
                        variant="bodyLarge" 
                        style={{ 
                            fontWeight: sex === "female" ? "bold" : "normal", 
                            color: sex === "female" ? "pink" : "black",
                            minWidth: 65, // Adjusted to fit Female properly
                            textAlign: "center" // Keeps it visually aligned
                        }}
                    >
                        Female
                    </Text>
                </View>

                {/* Additional Info Box */}
                <Text variant="titleMedium" style={{ marginTop: 20 }}>Additional Information</Text>
                <TextInput
                    label="Enter any other details..."
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    multiline
                    numberOfLines={4}
                    mode="outlined"
                    style={{ backgroundColor: theme.colors.surface, height: 100 }}
                />

                {/* Save Button */}
                <Button mode="contained" onPress={() => console.log("Settings Saved")} style={{ marginTop: 20 }}>
                    Save Changes
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
