import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, StyleSheet, Image } from "react-native";
import { Location, Business } from "@/utils/type";

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
          <Image source={{uri: data.image}} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.category}>{data.category}</Text>
            <Text style={styles.description}>
              {data.description}
            </Text>
          </View>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "gray",
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    maxWidth: "100%", // Adjust this value as needed
    flexShrink: 1,
  },
});
