
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { AIMessage } from '@/types/ai';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createUserMessage, 
  createAIMessage, 
  getErrorMessage, 
  getWelcomeMessage, 
  formatConversationHistory 
} from '@/utils/aiChatUtils';
import ExamplePrompts from './ExamplePrompts';
import { useTheme } from '@/contexts/ThemeContext';

interface AIChatProps {
  language: 'sk' | 'en';
}

interface AIChatRef {
  clearChatHistory: () => void;
}

const TypingIndicator = () => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = () => {
      const duration = 600;
      const sequence = Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: duration / 3, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: duration / 3, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: duration / 3, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.4, duration: duration / 3, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0.4, duration: duration / 3, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0.4, duration: duration / 3, useNativeDriver: true }),
      ]);
      
      Animated.loop(sequence).start();
    };

    animate();
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingIndicator}>
      <Animated.View style={[styles.typingDot, { opacity: dot1, backgroundColor: colors.textSecondary }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2, backgroundColor: colors.textSecondary }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3, backgroundColor: colors.textSecondary }]} />
    </View>
  );
};

const AIChat = forwardRef<AIChatRef, AIChatProps>(({ language }, ref) => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load chat history on component mount and language change
  useEffect(() => {
    loadChatHistory();
  }, [language]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages, language]);

  const getChatStorageKey = () => `ai_chat_history_${language}`;

  const loadChatHistory = async () => {
    try {
      const storageKey = getChatStorageKey();
      const savedMessages = await AsyncStorage.getItem(storageKey);
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } else {
        // Set initial welcome message
        const welcomeMessage = createAIMessage(getWelcomeMessage(language));
        welcomeMessage.id = '1'; // Set consistent ID for welcome message
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Set fallback welcome message
      const welcomeMessage = createAIMessage(getWelcomeMessage(language));
      welcomeMessage.id = '1'; // Set consistent ID for welcome message
      setMessages([welcomeMessage]);
    }
  };

  const saveChatHistory = async () => {
    try {
      const storageKey = getChatStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      const storageKey = getChatStorageKey();
      await AsyncStorage.removeItem(storageKey);
      
      const welcomeMessage = createAIMessage(getWelcomeMessage(language));
      setMessages([welcomeMessage]);
      setConnectionError(false);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = createUserMessage(inputText);
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputText.trim();
    setInputText('');
    setIsLoading(true);
    setConnectionError(false);

    try {
      console.log('Sending message to AI:', currentInput);
      
      // Prepare conversation history for context
      const conversationHistory = formatConversationHistory(messages);

      // Call Supabase Edge Function with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );

      const requestPromise = supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput,
          language: language,
          conversationHistory: conversationHistory
        }
      });

      const { data, error } = await Promise.race([requestPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Supabase function error:', error);
        setConnectionError(true);
        throw error;
      }

      console.log('AI response received:', data);

      const aiResponse = createAIMessage(
        data.response || (language === 'sk' 
          ? 'Prepáčte, nepodarilo sa mi vygenerovať odpoveď. Skúste to znovu.'
          : 'Sorry, I couldn\'t generate a response. Please try again.')
      );

      setMessages(prev => [...prev, aiResponse]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError(true);
      
      const errorMessage = createAIMessage(getErrorMessage(language, error));
      setMessages(prev => [...prev, errorMessage]);
      
      // Don't show alert for timeout or network errors, just show in chat
      if (!error?.message?.includes('timeout') && !error?.message?.includes('fetch')) {
        Alert.alert(
          language === 'sk' ? 'Chyba' : 'Error',
          getErrorMessage(language, error)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.isUser) {
        setInputText(lastUserMessage.content);
      }
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearChatHistory,
  }));

  const renderMessage = (message: AIMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={[
        styles.messageBubble,
        message.isUser 
          ? [styles.userBubble, { backgroundColor: colors.primary }]
          : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser 
            ? [styles.userText, { color: colors.card }]
            : [styles.aiText, { color: colors.text }],
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {messages.length <= 1 && (
          <ExamplePrompts 
            language={language} 
            onPromptSelect={handlePromptSelect}
          />
        )}
        
        {connectionError && (
          <View style={[styles.errorBanner, { backgroundColor: colors.error + '20', borderBottomColor: colors.error + '40' }]}>
            <IconSymbol name="wifi.slash" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>
              {language === 'sk' 
                ? 'Problém s pripojením. Skontrolujte internet.'
                : 'Connection issue. Check your internet.'}
            </Text>
            <TouchableOpacity onPress={retryLastMessage} style={[styles.retryButton, { backgroundColor: colors.error }]}>
              <Text style={[styles.retryText, { color: colors.card }]}>
                {language === 'sk' ? 'Skúsiť znovu' : 'Retry'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TypingIndicator />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              language === 'sk' 
                ? 'Opýtajte sa na gramatiku...'
                : 'Ask about grammar...'
            }
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: (!inputText.trim() || isLoading) ? colors.surface : colors.primary },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <IconSymbol 
              name={isLoading ? "hourglass" : "arrow.up"} 
              size={20} 
              color={(!inputText.trim() || isLoading) ? colors.textSecondary : colors.card} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  loadingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {},
  aiText: {},
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AIChat;
