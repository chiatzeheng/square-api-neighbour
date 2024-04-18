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
import { Image } from "expo-image";
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
        <View key={business.businessID} style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {business.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.businessImage}
              />
            ))}
          </ScrollView>
          <Text style={styles.headerText}>{business.name}</Text>
          <Text style={styles.labelText}>{business.location}</Text>
          <Text style={styles.labelText}>Reviews: {business.reviews}</Text>
        </View>
      ))}
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
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  businessImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default Screen;