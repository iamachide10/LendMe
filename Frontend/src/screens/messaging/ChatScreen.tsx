import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getMessages, markConversationAsRead } from '../../api/messageApi';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import { Message } from '../../types/message.types';
import ChatBubble from '../../components/messaging/ChatBubble';
import { useSocket } from '../../hooks/useSocket';
import { useTheme, ThemeColors } from '../../theme';
import { formatDateLabel, getDayKey } from '../../utils/dateFormat';
import { buildItemTag } from '../../utils/itemMessage';

type Props = NativeStackScreenProps<HomeStackParamList, 'ChatScreen'>;

type ChatListItem =
  | { type: 'date'; id: string; label: string }
  | { type: 'message'; id: string; message: Message };

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, otherUserName, receiverId, itemContext } = route.params;
  const { activeMessages, setActiveMessages, appendMessage } = useMessageStore();
  const user = useAuthStore(state => state.user);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pendingItem, setPendingItem] = useState(itemContext ?? null);
  const flatListRef = useRef<FlatList>(null);

  const lastMessageId = activeMessages.length > 0
    ? activeMessages[activeMessages.length - 1].id
    : null;

  const handleNewMessage = useCallback((msg: Message) => {
    if (msg.senderId !== user?.id) {
      appendMessage(msg);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [user?.id]);

  const { sendMessage } = useSocket(handleNewMessage, conversationId, lastMessageId);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);
        setActiveMessages(data);
        await markConversationAsRead(conversationId);
      } catch {
        console.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => setActiveMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (activeMessages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [activeMessages.length]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    // Attach the item summary to the first message sent from an item page
    const itemPrefix = pendingItem
      ? buildItemTag(pendingItem.itemId, pendingItem.title, pendingItem.price)
      : '';
    const content = itemPrefix + message.trim();
    setMessage('');
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: user?.id || '',
      senderName: user?.name || '',
      content,
      isRead: false,
      sentAt: new Date().toISOString(),
    };
    appendMessage(optimisticMsg);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const saved = await sendMessage(receiverId, content);
      setPendingItem(null);
      // Replace optimistic message with real one
      setActiveMessages(
        activeMessages
          .filter(m => m.id !== optimisticMsg.id)
          .concat(saved)
      );
    } catch {
      Alert.alert('Error', 'Failed to send message');
      // Remove optimistic message on failure
      setActiveMessages(activeMessages.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleItemPress = (itemId: string) => {
    // ItemDetail lives in the Home tab's stack; navigate falls through to the tab navigator
    (navigation as any).navigate('Home', {
      screen: 'ItemDetail',
      params: { itemId },
    });
  };

  const listItems = useMemo(() => {
    const items: ChatListItem[] = [];
    let lastDayKey = '';
    for (const msg of activeMessages) {
      const dayKey = getDayKey(msg.sentAt);
      if (dayKey !== lastDayKey) {
        items.push({ type: 'date', id: `date-${dayKey}`, label: formatDateLabel(msg.sentAt) });
        lastDayKey = dayKey;
      }
      items.push({ type: 'message', id: msg.id, message: msg });
    }
    return items;
  }, [activeMessages]);

  const renderItem = ({ item }: { item: ChatListItem }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <View style={styles.dateSeparatorPill}>
            <Text style={styles.dateSeparatorText}>{item.label}</Text>
          </View>
        </View>
      );
    }
    return (
      <ChatBubble
        message={item.message}
        isOwn={item.message.senderId === user?.id}
        onItemPress={handleItemPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherUserName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.headerName}>{otherUserName}</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 0}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={listItems}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {/* Item context banner — attached to the next message sent */}
        {pendingItem && (
          <View style={styles.itemBanner}>
            <Ionicons name="cube" size={16} color={colors.primary} />
            <Text style={styles.itemBannerText} numberOfLines={1}>
              Asking about: <Text style={styles.itemBannerTitle}>{pendingItem.title}</Text>
            </Text>
            <TouchableOpacity onPress={() => setPendingItem(null)}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || sending) ? styles.sendButtonDisabled : null,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color={colors.primaryContrast} size="small" />
            ) : (
              <Ionicons name="arrow-up" size={20} color={colors.primaryContrast} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    width: 50,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  messagesList: {
    paddingVertical: 16,
    paddingBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemBannerText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
  },
  itemBannerTitle: {
    color: colors.text,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 21,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorPill: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dateSeparatorText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ChatScreen;
