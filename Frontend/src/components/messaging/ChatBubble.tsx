import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../types/message.types';

interface Props {
  message: Message;
  isOwn: boolean;
}

const ChatBubble: React.FC<Props> = ({ message, isOwn }) => {
  const time = new Date(message.sentAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : null]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={styles.content}>{message.content}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#e94560',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 4,
  },
  content: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ChatBubble;