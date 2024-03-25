import React from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import BottomDraggableDrawer from "@/components/BottomDraggableDrawer";
import { Location } from "@/utils/type";

const data = [
  {
    "locationID": 952742548109000705,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "latitudeDelta": 0.01,
    "longitudeDelta": 0.01
  },
  {
    "locationID": 952742548109164545,
    "latitude": 1.2815,
    "longitude": 103.8636,
    "latitudeDelta": 0.03,
    "longitudeDelta": 0.05
  },
  {
    "locationID": 952742548109197313,
    "latitude": 1.2494,
    "longitude": 103.8303,
    "latitudeDelta": 0.03,
    "longitudeDelta": 0.04
  },
  {
    "locationID": 952742548109230081,
    "latitude": 1.2839,
    "longitude": 103.8436,
    "latitudeDelta": 0.02,
    "longitudeDelta": 0.03
  },
  {
    "locationID": 952742548109262849,
    "latitude": 1.3035,
    "longitude": 103.8323,
    "latitudeDelta": 0.03,
    "longitudeDelta": 0.04
  }
]

const GlobalMapView = () => {
  const navigation = useNavigation();

  const mapRef = React.useRef<MapView>(null);

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["locations"],
  //   queryFn: async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://${process.env.EXPO_PUBLIC_URL}/fetchLocations`
  //       );
  //       return res.data;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // });

  const focusMap = () => {
    const initialRegion = {
      latitude: 1.3521,
      longitude:  103.8198,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(initialRegion);
    mapRef.current?.animateCamera(
      { center: initialRegion, zoom: 12 },
      { duration: 2000 }
    );
  };

  const onMarkerSelected = (marker: Location) => {
    Alert.alert(`Location ID: ${marker.locationID}`);
  };

  const calloutPressed = (marker: Location) => {
    console.log(marker);
  };

  const renderMarkers = () => {
    return data?.map((marker: Location, index: number) => (
      <Marker
        key={index}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => onMarkerSelected(marker)}
      >
        <Callout onPress={() => calloutPressed(marker)}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 16 }}>
              Location ID: {marker.locationID}
            </Text>
            <Text style={{ fontSize: 16 }}>Latitude: {marker.latitude}</Text>
            <Text style={{ fontSize: 16 }}>Longitude: {marker.longitude}</Text>
          </View>
        </Callout>
      </Marker>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      >
        {/* {isLoading || error ? null : renderMarkers()} */}
        { data?.map((marker: Location, index: number) => (
      <Marker
        key={index}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => onMarkerSelected(marker)}
      >
        <Callout onPress={() => calloutPressed(marker)}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 16 }}>
              Location ID: {marker.locationID}
            </Text>
            <Text style={{ fontSize: 16 }}>Latitude: {marker.latitude}</Text>
            <Text style={{ fontSize: 16 }}>Longitude: {marker.longitude}</Text>
          </View>
        </Callout>
      </Marker>
    ))}
        <Header />
      </MapView>
      <TouchableOpacity
        onPress={focusMap}
        style={{ position: "absolute", top: 20, right: 20, zIndex: 999 }}
      >
        <View
          style={{ padding: 10, backgroundColor: "white", borderRadius: 5 }}
        >
          <Text>Focus</Text>
        </View>
      </TouchableOpacity>
      <BottomDraggableDrawer />
    </View>
  );
};

export default GlobalMapView;
