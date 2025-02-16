import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Chip } from "react-native-paper";

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  const lightR = Math.floor((r + 255) / 2);
  const lightG = Math.floor((g + 255) / 2);
  const lightB = Math.floor((b + 255) / 2);

  return `rgb(${lightR}, ${lightG}, ${lightB})`;
};

const MealCard = ({ meal, expanded, onPress }) => {
  return (
    <Card style={{ marginBottom: 15, backgroundColor: "white", borderRadius: 10 }}>
      <TouchableOpacity onPress={onPress}>
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

      {expanded && (
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Ingredients:</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>{meal.ingredients}</Text>
        </View>
      )}
    </Card>
  );
};

export default MealCard;
