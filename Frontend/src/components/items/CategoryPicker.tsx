import React, { useMemo } from 'react';
import {ScrollView,TouchableOpacity,Text,StyleSheet,} from 'react-native';
import { ItemCategory } from '../../types/item.types';
import { ITEM_CATEGORIES } from '../../utils/constants';
import { useTheme, ThemeColors } from '../../theme';
interface Props {
  selected: ItemCategory | undefined;
  onSelect: (category: ItemCategory | undefined) => void;
}

const CategoryPicker: React.FC<Props> = ({ selected, onSelect }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
   <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.scrollView}
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

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
 container: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
},
scrollView: {
  flexGrow: 0,
  flexShrink: 0,
  height: 60,
},

chip: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginRight: 8,
  borderRadius: 20,
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.border,
  minHeight: 36,
  justifyContent: 'center',
  flexShrink: 0,
},
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.primaryContrast,
    fontWeight: 'bold',
  },
});

export default CategoryPicker;
