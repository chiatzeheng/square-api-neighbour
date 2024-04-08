import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Location as Loc } from '@/utils/type';
import { calculateDeltas } from '@/utils/functions';

interface Locs extends Omit<Loc, 'locationID' > {}

export default function App() {

  const [region, setRegion] = useState<Locs| null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable location services to use this app.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const deltas = calculateDeltas(Dimensions.get('window').width / Dimensions.get('window').height, location.coords.longitude);    
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas, // Spread the calculated delta values
    });
  };

  const handleMapPress = (event: any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      Alert.alert(
        'Confirm Location',
        'Would you like to select this location?',
        [
          {
            text: 'No',
            onPress: () => setSelectedLocation(null),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              // Navigate to another page or perform any action here
              console.log('Selected location:', selectedLocation);
            },
          },
        ]
      );
    } else {
      Alert.alert('No Location Selected', 'Please select a location on the map.');
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>
      )}
      {!selectedLocation && (
        <Text style={styles.promptText}>Tap on the map to select a location.</Text>
      )}
      <Button
        title="Confirm Location"
        onPress={confirmLocation}
        disabled={!selectedLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  promptText: {
    marginBottom: 20,
  },
});
