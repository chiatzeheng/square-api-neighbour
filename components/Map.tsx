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
      <BottomDraggableDrawer />
    </View>
  );
};

export default GlobalMapView;
