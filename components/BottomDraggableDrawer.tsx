import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Carousell from "@/components/Carousell";

const App = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "70%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headingText}>
          Welcome to Neighbours🔥
        </Text>
        <Text style={styles.subheadingText}>
          Connect with your neighbors, discover local events, and share
          community updates.
        </Text>
        <Carousell />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#ffffff",
    margin: 20,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    borderRadius: 25,
    backgroundColor: "#e7e7e7",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black"
  },
  subheadingText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "black"
  },
});

export default App;

