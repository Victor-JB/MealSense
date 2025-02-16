import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Chip, Button } from "react-native-paper";
import { getUserOrderHistory, setUserOrderHistory } from "../mainService";
import { useUserProfile, useHistory } from "./mainContext";

const DEFAULT_IMAGE = require("../assets/images/santaClaraBackground.png");

export const getTagColor = (tag: string) => {
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

const formatPrice = (price) => {
  return price ? `$${parseFloat(price).toFixed(2)}` : "N/A";
};

const formatTag = (tag: string) => {
  return tag
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const MealCard = ({ meal, expanded, onPress }) => {
  const [purchased, setPurchased] = useState(false);
  const { setUserProfile } = useUserProfile();
  const { setUserHistory, userHistory } = useHistory();
  meal.modifications = meal.modifications || "";

  const handlePurchase = async () => {
    setPurchased(true);
    const newHistory = [...userHistory, orderData];
    setUserHistory(newHistory);
    await setUserOrderHistory(newHistory);
    console.log(`Purchased: ${meal.name}`);
  }

  const orderData = {
    name: meal.name,
    timestamp: new Date().toLocaleString(),
    tags: meal.tags,
    reason: meal.reason,
    modifications: meal.modifications
  };

//   useEffect(() => {
//     const updatedHistory = await getUserOrderHistory();
//     setUserOrderHistory(updatedHistory);
//   }, [getUserOrderHistory]);

  setTimeout(() => setPurchased(false), 3000);

  return (
    <Card
      style={{
        marginBottom: 15,
        backgroundColor: purchased ? "#D1F2EB" : "white",
        borderRadius: 10,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
          <Image source={meal.image || DEFAULT_IMAGE} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{meal.name}</Text>
            <Text numberOfLines={1} style={{ fontSize: 14, color: "gray" }}>
              Modifications: {meal.modifications.length > 25 ? meal.modifications.substring(0, 25) + "..." : meal.modifications}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
              {meal.tags.map((tag, i) => (
                <Chip key={i} style={{ marginRight: 5, marginBottom: 5, backgroundColor: getTagColor(tag) }}>
                  {formatTag(tag)}
                </Chip>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Modifications:</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>{meal.modifications}</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Reason:</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>{meal.reason}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>{formatPrice(meal.price)}</Text>
            <Button mode="contained" onPress={handlePurchase} disabled={purchased}>
              {purchased ? "Purchased" : "Buy Now"}
            </Button>
          </View>
        </View>
      )}
    </Card>
  );
};

export default MealCard;
