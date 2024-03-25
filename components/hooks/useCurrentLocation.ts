import { useState, useEffect, useMemo } from "react";
import * as Location from "expo-location";
import { Region } from "@/utils/type";

const useCurrentLocation = () => {
  const [location, _] = useState<Region>(null);

  const initialRegion = useMemo(
    () => ({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    []
  );

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.log(error);
    }

    return location || initialRegion;
  };

  
};

export default useCurrentLocation;
