import React, { useState, useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";


const App = () => {
    const params = useLocalSearchParams<{ id: string }>();
    const [ images, setImages] = useState<string[] | null>(null)

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        images != null ? (setImages([...images, result.assets[0].uri])): (setImages([result.assets[0].uri])) 
    };

  const removeImage = (index: number) => {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    };


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
        console.log(res.data)
        return res.data;
       
      } catch (error) {
        console.log(error);
      }
    }
  })



  return (
    <View>

    </View>
  );
}
};
