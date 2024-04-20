import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { calculateDeltas } from "@/utils/functions";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Location as Loc } from "@/utils/type";
import { useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function App() {
  const params = useLocalSearchParams<{ id: string }>();
  const [region, setRegion] = useState<Loc | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (data: Loc | null) =>
      axios.post(`http://${process.env.EXPO_PUBLIC_URL}:8080/postLocation`, {
        data,
      }),
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
    },
    onSuccess(data) {
      router.replace({
        pathname: `/(page)/[id]`,
        params: { id: params?.id },
      });
    },
  });

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let cachedLocation = await Location.getLastKnownPositionAsync();
    if (cachedLocation) {
      setRegion({
        locationID: params.id,
        latitude: cachedLocation.coords.latitude,
        longitude: cachedLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please enable location services to use this app."
      );
      return;
    }

    setIsLoading(true);

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    setRegion({
      locationID: params.id,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setIsLoading(false);
  };

  const handleMapPress = (event: any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    confirmLocation();
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      Alert.alert(
        "Confirm Location",
        "Would you like to select this location?",
        [
          {
            text: "No",
            onPress: () => setSelectedLocation(null),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await mutate(region);
            },
          },
        ]
      );
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : region ? (
        <>
          <MapView style={styles.map} region={region} onPress={handleMapPress}>
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
          <View style={styles.overlay}>
            <Text style={styles.promptText}>
              Tap on the map to select a location.
            </Text>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <Pressable style={styles.backButton} onPress={goBack}>
                <Text style={styles.buttonText}>Go Back</Text>
              </Pressable>
              {!isLoading && selectedLocation && (
                <Pressable
                  style={styles.reject}
                  onPress={() => setSelectedLocation(null)}
                >
                  <Entypo name="cross" size={24} color="white" />
                </Pressable>
              )}
            </View>

            {/* Back Button */}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF", // White background
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlay: {
    position: "absolute",
    top: "80%",
    left: 0,
    right: 0,
    borderRadius: 25,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    padding: 20, // Adjusted margin top to center the overlay vertically and give it a 20 pixel margin from the top
  },
  promptText: {
    marginBottom: 20,
    fontSize: 16,
    color: "#666", // Grey color
  },
  button: {
    backgroundColor: "#0000ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 10,
  },
  reject: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Grey color
  },
  buttonText: {
    color: "#FFFFFF", // White color
    fontSize: 16,
    fontWeight: "bold",
  },
});
