import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Item } from '../../types/item.types';

interface Props {
  item: Item;
  onPress: (item: Item) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ItemCard: React.FC<Props> = ({ item, onPress }) => {
  const primaryImage = item.images?.find(img => img.isPrimary)?.imageUrl;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      {primaryImage ? (
        <Image source={{ uri: primaryImage }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.category}>
          {item.category.charAt(0) + item.category.slice(1).toLowerCase()}
        </Text>
        <Text style={styles.price}>
          GH₵ {item.dailyPrice.toFixed(2)}
          <Text style={styles.perDay}> / day</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#16213e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 130,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#a0a0b0',
    fontSize: 12,
  },
  info: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    color: '#a0a0b0',
    fontSize: 11,
    marginBottom: 6,
  },
  price: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: 'bold',
  },
  perDay: {
    color: '#a0a0b0',
    fontSize: 11,
    fontWeight: 'normal',
  },
});

export default ItemCard;