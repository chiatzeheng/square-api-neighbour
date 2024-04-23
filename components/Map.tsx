import React, { useMemo } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import BottomDraggableDrawer from "@/components/BottomDraggableDrawer";
import { Markers } from "@/components/Markers";
import * as location from "expo-location";

const GlobalMapView = ({ locations }: any) => {
  const { data, isLoading, error } = locations;
  const mapRef = React.useRef<MapView>(null);

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
        : data?.map((item: any, index: number) => (
            <Markers key={index} data={item} />
          )),
    [isLoading, error, data]
  );

  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchProducts`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const businesses = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchBusinesses`
        );

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
      <Header businesses={businesses.data} products={products.data} />
      <BottomDraggableDrawer data={businesses} />
    </View>
  );
};

export default GlobalMapView;
