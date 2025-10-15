
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/contexts/ThemeContext';
import AppDiagnostics from '@/components/AppDiagnostics';

export default function ProfileScreen() {
  const { language, setLanguage } = useLanguage();
  const { decks, progress } = useFlashcards();
  const { themeMode, isDark, setThemeMode } = useTheme();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const colors = getColors(isDark);

  const handleLanguageChange = (newLanguage: 'sk' | 'en') => {
    setLanguage(newLanguage);
  };

  const stats = [
    { label: 'Total Decks', value: decks.length, icon: 'book.stack' },
    { label: 'Total Cards', value: progress.totalCards, icon: 'rectangle.stack' },
    { label: 'Cards Learned', value: progress.cardsLearned, icon: 'checkmark.circle' },
    { label: 'Study Streak', value: `${progress.streakDays} days`, icon: 'flame' },
  ];

  const themeOptions = [
    { value: 'light' as const, label: '☀️ Light', icon: 'sun.max' },
    { value: 'dark' as const, label: '🌙 Dark', icon: 'moon' },
    { value: 'auto' as const, label: '⚙️ Auto', icon: 'gear' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity 
            style={[styles.diagnosticsButton, { backgroundColor: colors.card }]}
            onPress={() => setShowDiagnostics(true)}
          >
            <IconSymbol name="gear" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* User Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
                  <IconSymbol name={stat.icon as any} size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Theme Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeButton,
                    { backgroundColor: colors.card, borderColor: 'transparent' },
                    themeMode === option.value && { 
                      borderColor: colors.primary, 
                      backgroundColor: colors.primary + '10' 
                    },
                  ]}
                  onPress={() => setThemeMode(option.value)}
                >
                  <Text style={[
                    styles.themeText,
                    { color: colors.text },
                    themeMode === option.value && { color: colors.primary, fontWeight: '600' },
                  ]}>
                    {option.label}
                  </Text>
                  {themeMode === option.value && (
                    <IconSymbol name="checkmark" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Language Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Language Settings</Text>
            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  { backgroundColor: colors.card, borderColor: 'transparent' },
                  language === 'en' && { 
                    borderColor: colors.primary, 
                    backgroundColor: colors.primary + '10' 
                  },
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageText,
                  { color: colors.text },
                  language === 'en' && { color: colors.primary, fontWeight: '600' },
                ]}>
                  🇺🇸 English
                </Text>
                {language === 'en' && (
                  <IconSymbol name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageButton,
                  { backgroundColor: colors.card, borderColor: 'transparent' },
                  language === 'sk' && { 
                    borderColor: colors.primary, 
                    backgroundColor: colors.primary + '10' 
                  },
                ]}
                onPress={() => handleLanguageChange('sk')}
              >
                <Text style={[
                  styles.languageText,
                  { color: colors.text },
                  language === 'sk' && { color: colors.primary, fontWeight: '600' },
                ]}>
                  🇸🇰 Slovenčina
                </Text>
                {language === 'sk' && (
                  <IconSymbol name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Study Tips */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Tips</Text>
            <View style={styles.tipsContainer}>
              <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
                <IconSymbol name="lightbulb" size={20} color={colors.accent} />
                <Text style={[styles.tipText, { color: colors.text }]}>
                  Review cards daily for better retention using spaced repetition.
                </Text>
              </View>
              
              <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
                <IconSymbol name="target" size={20} color={colors.secondary} />
                <Text style={[styles.tipText, { color: colors.text }]}>
                  Focus on difficult cards by marking them as &apos;Hard&apos; during review.
                </Text>
              </View>
              
              <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
                <IconSymbol name="brain" size={20} color={colors.primary} />
                <Text style={[styles.tipText, { color: colors.text }]}>
                  Use the AI tutor to get explanations for grammar rules and corrections.
                </Text>
              </View>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.appName, { color: colors.text }]}>Flashcard Study App</Text>
              <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
              <Text style={[styles.appDescription, { color: colors.text }]}>
                A spaced repetition flashcard app with AI-powered grammar assistance 
                for Slovak and English learners.
              </Text>
            </View>
          </View>
        </ScrollView>

        {showDiagnostics && (
          <AppDiagnostics />
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  diagnosticsButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140, // Increased padding for floating tab bar
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  themeOptions: {
    gap: 12,
  },
  themeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  themeText: {
    fontSize: 16,
  },
  languageOptions: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  languageText: {
    fontSize: 16,
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
