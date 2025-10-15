
import { Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/hooks/useLanguage';
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import AIChat from '@/components/AIChat';

export default function AITutorScreen() {
  const { locale } = useLanguage();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [selectedLanguage, setSelectedLanguage] = useState<'sk' | 'en'>(locale as 'sk' | 'en');
  const [isOnline, setIsOnline] = useState(true);
  const aiChatRef = useRef<any>(null);

  const handleLanguageChange = (lang: 'sk' | 'en') => {
    setSelectedLanguage(lang);
    console.log('AI Tutor language changed to:', lang);
  };

  const handleClearChat = () => {
    Alert.alert(
      selectedLanguage === 'sk' ? 'Vymazať konverzáciu' : 'Clear Conversation',
      selectedLanguage === 'sk' 
        ? 'Ste si istí, že chcete vymazať celú konverzáciu?'
        : 'Are you sure you want to clear the entire conversation?',
      [
        {
          text: selectedLanguage === 'sk' ? 'Zrušiť' : 'Cancel',
          style: 'cancel',
        },
        {
          text: selectedLanguage === 'sk' ? 'Vymazať' : 'Clear',
          style: 'destructive',
          onPress: () => {
            if (aiChatRef.current?.clearChatHistory) {
              aiChatRef.current.clearChatHistory();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <IconSymbol name="brain" size={28} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>AI Grammar Tutor</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {selectedLanguage === 'sk' 
                  ? (isOnline ? 'Pripojené • Váš osobný asistent pre gramatiku' : 'Odpojené • Skontrolujte pripojenie')
                  : (isOnline ? 'Connected • Your personal grammar assistant' : 'Disconnected • Check connection')
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearChat}
            >
              <IconSymbol name="trash" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.languageSelector, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'en' && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageText,
                  { color: colors.text },
                  selectedLanguage === 'en' && { color: colors.card }
                ]}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'sk' && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleLanguageChange('sk')}
              >
                <Text style={[
                  styles.languageText,
                  { color: colors.text },
                  selectedLanguage === 'sk' && { color: colors.card }
                ]}>
                  SK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <AIChat ref={aiChatRef} language={selectedLanguage} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  clearButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  languageSelector: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingBottom: 120, // Extra padding for floating tab bar
  },
});
