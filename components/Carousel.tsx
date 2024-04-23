import React from "react";
import { FlatList } from "react-native";
import { Product, Business } from "@/utils/type";
import Cards from "@/components/Cards";

interface Props {
  data: Business[];
}

const Carousel = ({ business }: Props) => {
  return (
    <FlatList
      data={business.data}
      renderItem={({ item }) => <Cards item={item} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      decelerationRate={0.9}
    />
  );
};

export default Carousel;
