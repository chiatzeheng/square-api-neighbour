import React from 'react';
import { FlatList } from 'react-native';
import { Product, Business } from '@/utils/type';
import Cards from '@/components/Cards';

interface Props {
  data: (Product | Business)[];
}

const Carousel = ({ data }: Props) => {
  const uniqueKeyExtractor = (item: Product | Business, index: number) => {
    // Check if the item has a unique identifier
    if ('id' in item && item.id !== undefined) {
      return item.id.toString();
    }

    // If no unique identifier, combine multiple properties or use index as a fallback
    const identifiers = [
      item.name,
      item.businessID?.toString(),
      item.category,
      index.toString(),
    ];
    return identifiers.filter(Boolean).join('-');
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