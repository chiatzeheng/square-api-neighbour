import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Location, Business } from "@/utils/type";
import { Link } from "expo-router";

export const Markers = ({ data }: { data: Location & Business }) => {


  const onMarkerSelected = (marker: Location & Business) => {
    // Alert.alert(`Location ID: ${marker.locationID}`);
  };

  const calloutPressed = (marker: Location & Business) => {
    // console.log(marker);
  };


  
  
  return (
    <Marker
      key={data.locationID}
      coordinate={{ latitude: data.latitude, longitude: data.longitude }}
      onPress={() => onMarkerSelected(data)}
    >
      <Callout onPress={() => calloutPressed(data)}>
        <View style={styles.container}>
          {data.image && (
            <Link href={{pathname: `/(page)/[id]`,
            params: { id: data?.businessID }}} >
              <Image source={{ uri: data.image }} style={styles.image} />
            </Link>
            
          )}
          <View style={styles.textContainer}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.category}>{data.category}</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} numberOfLines={3}>
                {data.description}
              </Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%", // Adjust this value as needed
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "gray",
  },
  descriptionContainer: {
    flex: 1,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    maxWidth: 200, // Adjust this value as needed
    overflow: "hidden",
  },
});
