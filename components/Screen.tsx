import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image"
import { Business, Product } from "@/utils/type";
import { Link } from "expo-router";

const Screen = ({ business, products }: any) => {


  // 
  const isLoading = products.isLoading || business.isLoading;

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (products.error || business.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: {products.error?.message || business.error?.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {business.data?.map((business: Business) => (
        <View key={business.businessID}>
          <Text style={styles.headerText}>Welcome to {business.name}</Text>
          <Text style={styles.labelText}>{business.category}</Text>
          <Image source={{ uri: business.image }} style={styles.businessImage} />
          <Text style={styles.descriptionText}>{business.description}</Text>
        </View>
      ))}
    
      <View style={styles.gridContainer}>
    {products.data?.map((product: Product) => (
      <View key={product.productID} style={styles.productContainer}>
        <Image source={{ uri: product.image[0] }} style={styles.productImage} />
        <Text style={styles.labelText}>{product.name}</Text>
        <Text style={styles.descriptionText}>{product.description}</Text>
        <Text style={styles.priceText}>Price: ${product.price}</Text>
        <TouchableOpacity style={styles.addImageButton}>
          <Text style={styles.addImageText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>

<Link href={`/(location)/main`}  >
         <Text style={styles.labelText}>Commment on this Business</Text>
        </Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "red",
  },
  errorText: {
    color: "white",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  addImageButton: {
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addImageText: {
    color: "white",
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  // Modify the productContainer style to fit the grid layout
  productContainer: {
    width: "48%", // Adjust the width to fit two products per row
    marginBottom: 20,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  businessImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  productContainer: {
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Screen;
