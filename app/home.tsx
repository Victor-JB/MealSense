import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { MD3DarkTheme as defaultDark, useTheme, Card, Chip } from "react-native-paper";
import { fetchRecommendation, getTimeGreeting } from "../mainService";
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

const myGreeting = (): string => {
  try {
      const hour = new Date().getHours();
      
      if (typeof hour !== 'number') {
          return "Hello"; // Fallback greeting
      }
      
      if (hour < 12) {
          return "Good morning";
      } else if (hour < 18) {
          return "Good afternoon";
      } else {
          return "Good evening";
      }
  } catch (error) {
      console.error("Error in myGreeting:", error);
      return "Hello"; // Fallback greeting if anything fails
  }
};

const HomeScreen = ({ userName = "User" }) => {
  const theme = useTheme();
  const [expandedMeal, setExpandedMeal] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("never set");

  useEffect(() => {
    setGreeting(myGreeting());
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      loadRecommendations();
    }
  }, [user, authLoading]);

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
    <ScrollView style={{ flex: 1, backgroundColor: false ? theme.colors.background : "#750000" }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: false ? theme.colors.background : "#750000", alignItems: "center" }}>
        <Text style={{ color: true ? "white" : "#750000", fontSize: 22, fontWeight: "bold" }}>Santa Clara University</Text>
      </View>

      {/* Greeting */}
      <View style={{ backgroundColor: "white", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {greeting}, {userName}! 
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
                      <Chip key={i} style={{ marginRight: 5, backgroundColor: getTagColor(tag)}}>{tag}</Chip>
                    ))}
                  </View>
                </View>


                '
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
