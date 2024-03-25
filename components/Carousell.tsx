import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import { Image } from "expo-image"

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;

const CarouselCard = ({ item }:any) => (
  <View style={styles.cardContainer}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{item.title}</Text>
  </View>
);

const Carousell = () => {
  const [data] = useState([
    { id: 1, image: 'https://example.com/image1.jpg', title: 'Card 1' },
    { id: 2, image: 'https://example.com/image2.jpg', title: 'Card 2' },
    { id: 3, image: 'https://example.com/image3.jpg', title: 'Card 3' },
    { id: 4, image: 'https://example.com/image4.jpg', title: 'Card 4' },
  ]);

  return (
      <FlatList
        data={data}
        renderItem={({ item }) => <CarouselCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate={0.9}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  cardContainer: {
    width: cardWidth,
    marginHorizontal: 8,
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default Carousell;