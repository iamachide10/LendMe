import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../types/message.types';
import { useTheme, ThemeColors } from '../../theme';
import { formatTime12h } from '../../utils/dateFormat';
import { parseItemTag } from '../../utils/itemMessage';

interface Props {
  message: Message;
  isOwn: boolean;
  onItemPress?: (itemId: string) => void;
}

const ChatBubble: React.FC<Props> = ({ message, isOwn, onItemPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const time = formatTime12h(message.sentAt);
  const { itemTag, text } = parseItemTag(message.content);

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : null]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {itemTag && (
          <TouchableOpacity
            style={[styles.itemCard, isOwn ? styles.ownItemCard : styles.otherItemCard]}
            onPress={() => onItemPress?.(itemTag.itemId)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="cube"
              size={18}
              color={isOwn ? colors.primaryContrast : colors.primary}
            />
            <View style={styles.itemCardInfo}>
              <Text
                style={[styles.itemCardTitle, isOwn ? styles.ownContent : styles.otherContent]}
                numberOfLines={1}
              >
                {itemTag.title}
              </Text>
              <Text style={[styles.itemCardPrice, isOwn ? styles.ownTime : styles.otherTime]}>
                {itemTag.priceLabel} · Tap to view
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={isOwn ? colors.primaryContrast : colors.textMuted}
            />
          </TouchableOpacity>
        )}
        {text.length > 0 && (
          <Text style={[styles.content, isOwn ? styles.ownContent : styles.otherContent]}>
            {text}
          </Text>
        )}
        <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  ownItemCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  otherItemCard: {
    backgroundColor: colors.inputBackground,
  },
  itemCardInfo: {
    flex: 1,
  },
  itemCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemCardPrice: {
    fontSize: 11,
    marginTop: 2,
  },
  ownContent: {
    color: colors.primaryContrast,
  },
  otherContent: {
    color: colors.text,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  ownTime: {
    color: 'rgba(255,255,255,0.6)',
  },
  otherTime: {
    color: colors.textMuted,
  },
});

export default ChatBubble;
