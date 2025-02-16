import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme, Card, Chip } from "react-native-paper";
import { fetchRecommendation, getUserProfile } from "../mainService";
import useAuth from "../useAuth";

// Add this function after the imports and before the meals constant
const getTagColor = (tag: string) => {
  // Generate a hash from the tag string
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to RGB color
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;

  // Make the color lighter by mixing with white
  const lightR = Math.floor((r + 255) / 2);
  const lightG = Math.floor((g + 255) / 2);
  const lightB = Math.floor((b + 255) / 2);

  return `rgb(${lightR}, ${lightG}, ${lightB})`;
};

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
    tags: ["Protein", "Carbs"]
  },
  {
    name: "Salmon & Brown Rice",
    image: require("../assets/images/error404.png"), // Replace with actual image
    ingredients: "Grilled salmon, brown rice, asparagus, olive oil, garlic",
    tags: ["Bulk", "Reduce"]
  }
];

const HomeScreen = () => {
  const theme = useTheme();
  const [expandedMeal, setExpandedMeal] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState(meals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("never set");
  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setFirstName(userProfile.firstName);
        } else {
          console.log("Invalid user profile found");
          console.log(userProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    let greeting;
    if (typeof hour !== 'number') {
      greeting = "Hello";
    }

    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    setGreeting(greeting);
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      loadRecommendations();
    }
  }, [user, authLoading]);

  const loadRecommendations = async () => {
    try {
      console.log("QUERYING RECOMMENDATIONS");
      setLoading(true);
      setError("");
      // const data = await fetchRecommendation();
      // setRecommendations(data);
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecommendations();
  };

  if (authLoading) return <ActivityIndicator size="large" color={theme.colors.primary} />;
  if (!user) return <Text style={{ color: theme.colors.error, textAlign: "center" }}>Please log in to see meal recommendations.</Text>

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: false ? theme.colors.background : "#750000" }}
      refreshControl={(
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
      )}>
      <View style={{ padding: 20, backgroundColor: false ? theme.colors.background : "#750000", alignItems: "center" }}>
        <Text style={{ color: true ? "white" : "#750000", fontSize: 22, fontWeight: "bold" }}>Santa Clara University</Text>
      </View>

      <View style={{ backgroundColor: "white", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {greeting}, {firstName}!
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        {recommendations
          ? recommendations.map((meal, index) => (
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
                        <Chip key={i} style={{ marginRight: 5, backgroundColor: getTagColor(tag) }}>{tag}</Chip>
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
          ))
          : <Text style={{ textAlign: "center", color: theme.colors.error }}>No meal recommendations available.</Text>}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
