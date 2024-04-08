import React from 'react';
import { FlatList } from 'react-native';
import { Product, Business } from '@/utils/type';
import Cards from '@/components/Cards';

interface Props {
  data: (Product | Business)[];
}

const Carousel = ({ data }: Props) => {

  const uniqueKeyExtractor = (item: Product | Business, index: number) => {
    if ('id' in item && item.id !== undefined) {
      return item.id.toString();
    }
    return `${index}`;
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Cards item={item} />}
      keyExtractor={uniqueKeyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      decelerationRate={0.9}
    />
  );
};

export default Carousel;