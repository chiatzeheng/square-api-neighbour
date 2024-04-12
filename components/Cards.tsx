import React from "react";
import { View, StyleSheet, Dimensions, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window");
const cardWidth = width * 0.8;

const Cards = ({ item }: any) => {

  const router = useRouter()
  return (
    <View style={styles.cardContainer}>
      <Link
        href={{
          pathname: `/(page)/[id]`,
          params: { id: item?.businessID }
          
        }}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    marginHorizontal: 25,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  cardImage: {
    width: 250,
    height: 200,
    borderRadius: 8,
  },
  textContainer: {
    alignItems: "center", // Added to center the text
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center", // Added to center the text
  },
  cardCategory: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center", // Added to center the text
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 8,
    color: "gray",
    textAlign: "center", // Added to center the text
  },
});

export default Cards;