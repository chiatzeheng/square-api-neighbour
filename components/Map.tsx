import React, { useMemo } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import BottomDraggableDrawer from "@/components/BottomDraggableDrawer";
import { Markers } from "@/components/Markers";
import * as location from "expo-location";

const GlobalMapView = () => {
  const mapRef = React.useRef<MapView>(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchLocations`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const focusMap = () => {
    const initialRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    mapRef.current?.animateToRegion(initialRegion);
    mapRef.current?.animateCamera(
      { center: initialRegion, zoom: 12 },
      { duration: 2000 }
    );
  };

  const markerComponents = useMemo(
    () =>
      isLoading || error
        ? null
        : data?.map((item: any) => (
            <Markers key={`${item.locationID}-${item.latitude}-${item.longitude}`} data={item} />
          )),
    [isLoading, error, data]
  );

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      >
        {markerComponents}
      </MapView>
      <Header />
      <TouchableOpacity
        onPress={focusMap}
        style={{ position: "absolute", top: 20, right: 20, zIndex: 999 }}
      >
        <View style={{ padding: 10, backgroundColor: "white", borderRadius: 5 }}>
          <Text>Focus</Text>
        </View>
      </TouchableOpacity>
      <BottomDraggableDrawer />
    </View>
  );
};

export default GlobalMapView;