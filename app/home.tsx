import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme, Card, Chip } from "react-native-paper";
import { fetchRecommendation } from "../mainService";
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

const getTimeGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  else if (hours < 18) return "Good Afternoon";
  else return "Good Evening";
};

const HomeScreen = ({ userName = "User" }) => {
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
      setLoading(true);
      const data = await fetchRecommendation();
      setRecommendations(data);
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
