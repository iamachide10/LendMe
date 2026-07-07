import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation , useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getConversations } from '../../api/messageApi';
import { useMessageStore } from '../../store/messageStore';
import { Conversation } from '../../types/message.types';
import { useTheme, ThemeColors } from '../../theme';
import { parseItemTag } from '../../utils/itemMessage';
import { BASE_URL } from '../../utils/constants';

const previewText = (lastMessage?: string): string => {
  if (!lastMessage) return 'No messages yet';
  const { itemTag, text } = parseItemTag(lastMessage);
  if (!itemTag) return lastMessage;
  return text.length > 0 ? text : `📦 ${itemTag.title}`;
};

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const InboxScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { conversations, setConversations } = useMessageStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );
  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
  navigation.navigate('ChatScreen', {
    conversationId: item.id,
    otherUserName: item.otherUserName,
    receiverId: item.otherUserId,
  }

)
      }
    >
      {item.otherUserPhoto ? (
        <Image
          source={{ uri: `${BASE_URL}${item.otherUserPhoto}` }}
          style={styles.avatarImage}
        />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.otherUserName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{item.otherUserName}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {previewText(item.lastMessage)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Message a seller from an item listing to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    marginRight: 12,
  },
  avatarText: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.primaryContrast,
    fontSize: 11,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: colors.textMuted,
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default InboxScreen;
