import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Carousel from "@/components/Carousel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const App = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "60%"], []);

  const query1 = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://${process.env.EXPO_PUBLIC_URL}:8080/getProducts`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }
  })
  const query2 = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://${process.env.EXPO_PUBLIC_URL}:8080/fetchBusinesses`);
        return res.data;
        console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    }
  })


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
        <Carousel data={query1.data}/>
        <Text style={styles.headingText}>
          View Products 
        </Text>
        <Text style={styles.subheadingText}>
          Connect with your neighbors, discover local events, and share
          community updates.
        </Text>
        <Carousel data={query2.data} />
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

