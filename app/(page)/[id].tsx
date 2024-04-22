import React, { useState, useCallback, useRef, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Screen from "@/components/Screen";
import { ActivityIndicator } from "react-native";

const ViewScreen = () => {
  const params = useLocalSearchParams<{ id: string }>();

  const id = params.id;

  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchProducts?id=${id}`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const business = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchBusinessByID?id=${id}`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const isLoading = products.isLoading || business.isLoading;

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  } else return <Screen products={products.data} business={business.data} />;
};

export default ViewScreen;
