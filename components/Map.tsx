import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from 'react-native-maps';

const GlobalMapView = () => {
  return (
    <SafeAreaView>
      <MapView style={styles.map} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });

export default GlobalMapView;
