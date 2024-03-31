import React from "react";
import { View,  StyleSheet, Dimensions, Text, Image, } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.8;

const Cards = ({ item }: any) => {


  return (
    <View style={styles.cardContainer}>
      {item?.title ? (
        <Link href="/(page)/[id].tsx">
          {/* <Image source={{ uri: item.image }} style={styles.cardImage} /> */}
          <Text style={styles.cardTitle}>{item.title}</Text>
        </Link>
      ) : (
          <Link href="/(page)/[id].tsx">
          {/* <Image source={{ uri: item.image }} style={styles.cardImage} /> */}
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardTitle}>{item.category}</Text>
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    marginHorizontal: 8,
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
});

export default Cards;
