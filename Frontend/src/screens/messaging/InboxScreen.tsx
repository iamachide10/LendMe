import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InboxStackParamList } from '../../navigation/types';
import { Conversation } from '../../types/message.types';

type NavProp = NativeStackNavigationProp<InboxStackParamList,'InboxScreen'>;

const FAKE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participant1: '1',
    participant2: '2',
    otherUserName: 'Kwame Mensah',
    lastMessage: 'Is the camera still available?',
    unreadCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-2',
    participant1: '1',
    participant2: '3',
    otherUserName: 'Abena Asante',
    lastMessage: 'I will return it by Friday',
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-3',
    participant1: '1',
    participant2: '4',
    otherUserName: 'Kofi Boateng',
    lastMessage: 'Thanks for the quick response!',
    unreadCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-4',
    participant1: '1',
    participant2: '5',
    otherUserName: 'Kofi Boateng',
    lastMessage: 'Thanks for the quick response!',
    unreadCount: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-5',
    participant1: '1',
    participant2: '6',
    otherUserName: 'Kofi Boateng',
    lastMessage: 'Thanks for the quick response!',
    unreadCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-6',
    participant1: '1',
    participant2: '7',
    otherUserName: 'Kofi Boateng',
    lastMessage: 'Thanks for the quick response!',
    unreadCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'conv-7',
    participant1: '1',
    participant2: '8',
    otherUserName: 'Kofi Boateng',
    lastMessage: 'Thanks for the quick response!',
    unreadCount: 1,
    createdAt: new Date().toISOString(),
  },
];

const InboxScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [conversations] = useState<Conversation[]>(FAKE_CONVERSATIONS);

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          conversationId: item.id,
          otherUserName: item.otherUserName,
        })
      }
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.otherUserName.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
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
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#a0a0b0',
    fontSize: 13,
  },
});

export default InboxScreen;