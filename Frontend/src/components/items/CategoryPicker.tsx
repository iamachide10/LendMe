import React from 'react';
import {ScrollView,TouchableOpacity,Text,StyleSheet,} from 'react-native';
import { ItemCategory } from '../../types/item.types';
import { ITEM_CATEGORIES } from '../../utils/constants';
interface Props {
  selected: ItemCategory | undefined;
  onSelect: (category: ItemCategory | undefined) => void;
}

const CategoryPicker: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* All option */}
      <TouchableOpacity
        style={[styles.chip, !selected ? styles.chipActive : null]}
        onPress={() => onSelect(undefined)}
      >
        <Text style={[styles.chipText, !selected ? styles.chipTextActive : null]}>
          All
        </Text>
      </TouchableOpacity>

      {ITEM_CATEGORIES.map(category => (
        <TouchableOpacity
          key={category}
          style={[styles.chip, selected === category ? styles.chipActive : null]}
          onPress={() => onSelect(category)}
        >
          <Text
            style={[
              styles.chipText,
              selected === category ? styles.chipTextActive : null,
            ]}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 container: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
},

chip: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginRight: 8,
  borderRadius: 20,
  backgroundColor: '#16213e',
  borderWidth: 1,
  borderColor: '#0f3460',
  minHeight: 36,
  justifyContent: 'center',
  flexShrink: 0,
},
  chipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  chipText: {
    color: '#a0a0b0',
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryPicker;