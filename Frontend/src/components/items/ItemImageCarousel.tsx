import React, { useState } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ItemImage } from '../../types/item.types';
import { BASE_URL } from '../../utils/constants';

interface Props {
  images: ItemImage[];
}

const { width } = Dimensions.get('window');

const ItemImageCarousel: React.FC<Props> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={img => img.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      renderItem={({ item }) => {
      console.log('Carousel image URL:', item.imageUrl);
      console.log("Required" , `${BASE_URL}${item.imageUrl}`);
    

      return (
        <Image
          source={{ uri: `${BASE_URL}${item.imageUrl}` }}
          style={styles.image}
        />
      );
    }}
          />

      {/* Dots */}
      <View style={styles.dots}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex ? styles.dotActive : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width,
    height: 260,
    resizeMode: 'cover',
  },
  placeholder: {
    width,
    height: 260,
    backgroundColor: '#0f3460',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0f3460',
  },
  dotActive: {
    backgroundColor: '#e94560',
    width: 18,
  },
});

export default ItemImageCarousel;