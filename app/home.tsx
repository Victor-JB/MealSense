import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme, Card, Chip } from "react-native-paper";
import { fetchRecommendation, getTimeGreeting } from "../mainService";
import useAuth from "../useAuth";

const meals = [
  {
    name: "Grilled Chicken Bowl",
    image: require("../assets/images/error404.png"), // Replace with actual image
    ingredients: "Grilled chicken, quinoa, spinach, avocado, cherry tomatoes, lemon dressing",
    tags: ["Protein", "Bulk"]
  },
  {
    name: "Vegan Tofu Stir-Fry",
    image: require("../assets/images/error404.png"), // Replace with actual image
    ingredients: "Tofu, bell peppers, broccoli, carrots, soy sauce, sesame seeds",
    tags: ["Low Fat", "Carbs"]
  },
  {
    name: "Salmon & Brown Rice",
    image: require("../assets/images/error404.png"), // Replace with actual image
    ingredients: "Grilled salmon, brown rice, asparagus, olive oil, garlic",
    tags: ["Healthy Fats", "Reduce"]
  }
];

const HomeScreen = ({ userName = "User" }) => {
  const theme = {
    "colors": {
      "primary": "rgb(220, 184, 255)",
      "onPrimary": "rgb(71, 12, 122)",
      "primaryContainer": "rgb(95, 43, 146)",
      "onPrimaryContainer": "rgb(240, 219, 255)",
      "secondary": "rgb(208, 193, 218)",
      "onSecondary": "rgb(54, 44, 63)",
      "secondaryContainer": "rgb(77, 67, 87)",
      "onSecondaryContainer": "rgb(237, 221, 246)",
      "tertiary": "rgb(243, 183, 190)",
      "onTertiary": "rgb(75, 37, 43)",
      "tertiaryContainer": "rgb(101, 58, 65)",
      "onTertiaryContainer": "rgb(255, 217, 221)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(29, 27, 30)",
      "onBackground": "rgb(231, 225, 229)",
      "surface": "rgb(29, 27, 30)",
      "onSurface": "rgb(231, 225, 229)",
      "surfaceVariant": "rgb(74, 69, 78)",
      "onSurfaceVariant": "rgb(204, 196, 206)",
      "outline": "rgb(150, 142, 152)",
      "outlineVariant": "rgb(74, 69, 78)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(231, 225, 229)",
      "inverseOnSurface": "rgb(50, 47, 51)",
      "inversePrimary": "rgb(120, 69, 172)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(39, 35, 41)",
        "level2": "rgb(44, 40, 48)",
        "level3": "rgb(50, 44, 55)",
        "level4": "rgb(52, 46, 57)",
        "level5": "rgb(56, 49, 62)"
      },
      "surfaceDisabled": "rgba(231, 225, 229, 0.12)",
      "onSurfaceDisabled": "rgba(231, 225, 229, 0.38)",
      "backdrop": "rgba(51, 47, 55, 0.4)"
    }
  const theme = useTheme();
  const [expandedMeal, setExpandedMeal] = useState(null);
  const { user, loading: authLoading } = useAuth(); // Check auth state
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Only fetch if user is logged in
    if (user && !authLoading) {
      loadRecommendations();
    }
  }, [user, authLoading]); // Runs only when user is set

  const loadRecommendations = async () => {
    try {
      console.log("QUERYING RECOMMENDATIONS");
      // setLoading(true);
      // const data = await fetchRecommendation();
      // setRecommendations(data);
      setError("");
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <ActivityIndicator size="large" color={theme.colors.primary} />;
  if (!user) return <Text style={{ color: theme.colors.error, textAlign: "center" }}>Please log in to see meal recommendations.</Text>

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#750000" }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: "#750000", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>Santa Clara University</Text>
      </View>

      {/* Greeting */}
      <View style={{ backgroundColor: "white", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {getTimeGreeting()}, {userName}!
        </Text>
      </View>

      {/* Meals List */}
      <View style={{ padding: 15 }}>
        {meals.map((meal, index) => (
          <Card key={index} style={{ marginBottom: 15, backgroundColor: "white", borderRadius: 10 }}>
            <TouchableOpacity onPress={() => setExpandedMeal(expandedMeal === index ? null : index)}>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
                <Image source={meal.image} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{meal.name}</Text>
                  <Text numberOfLines={1} style={{ fontSize: 14, color: "gray" }}>
                    {meal.ingredients.length > 40 ? meal.ingredients.substring(0, 40) + "..." : meal.ingredients}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {meal.tags.map((tag, i) => (
                      <Chip key={i} style={{ marginRight: 5 }}>{tag}</Chip>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {expandedMeal === index && (
              <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Ingredients:</Text>
                <Text style={{ fontSize: 14, color: "gray" }}>{meal.ingredients}</Text>
              </View>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
