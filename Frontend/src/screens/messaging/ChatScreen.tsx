import React, { useEffect, useState, useRef } from 'react';
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
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../hooks/useSocket';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getMessages ,markConversationAsRead } from '../../api/messageApi';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import { Message } from '../../types/message.types';
import { WEBSOCKET_URL } from '../../utils/constants';
import ChatBubble from '../../components/messaging/ChatBubble';
import TypingIndicator from '../../components/messaging/TypingIndicator';
import { io, Socket } from 'socket.io-client';


type Props = NativeStackScreenProps<HomeStackParamList, 'ChatScreen'>;

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, otherUserName } = route.params;
  const { activeMessages, setActiveMessages, appendMessage } = useMessageStore();
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<Socket | null>(null);


const { sendMessage } = useSocket((msg: Message) => {
  console.log('WS message received:', JSON.stringify(msg));
  if (msg.conversationId === conversationId) {
    appendMessage(msg);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }
});
useEffect(() => {
  const fetchMessages = async () => {
    try {
      const data = await getMessages(conversationId);
      setActiveMessages(data);
      await markConversationAsRead(conversationId); // ← add this
    } catch {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();

  return () => setActiveMessages([]);
}, [conversationId]);


const handleSend = () => {
  console.log("Send button pressed");

  if (!message.trim()) {
    console.log("Message is empty");
    return;
  }

  console.log("receiverId:", route.params.receiverId);
  console.log("message:", message);

  sendMessage(route.params.receiverId, message.trim());
  setMessage('');
};

//   const handleTyping = (text: string) => {
//   setMessage(text);
// };

  const handleTyping = (text: string) => {
    setMessage(text);
    socketRef.current?.emit('typing', { conversationId });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <ChatBubble message={item} isOwn={item.senderId === user?.id} />
  );

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >

        {/* Messages */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#e94560" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={activeMessages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={message}
            onChangeText={handleTyping}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() ? styles.sendButtonDisabled : null,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  backText: {
    color: '#e94560',
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
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerName: {
    color: '#fff',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ChatScreen;