
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';

interface ExamplePromptsProps {
  language: 'sk' | 'en';
  onPromptSelect: (prompt: string) => void;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ language, onPromptSelect }) => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const prompts = language === 'sk' ? [
    'Vysvetli mi rozdiel medzi "som" a "je"',
    'Ako sa časuje sloveso "ísť" v minulom čase?',
    'Kedy používam "ktorý" a kedy "aký"?',
    'Oprav mi túto vetu: "Ja mám rád čítanie knihy"',
    'Aké sú pravidlá pre používanie čiarok?',
  ] : [
    'Explain the difference between "have" and "has"',
    'How do I use past perfect tense?',
    'When do I use "a" vs "an"?',
    'Correct this sentence: "I have went to the store"',
    'What are the rules for using commas?',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {language === 'sk' ? 'Príklady otázok:' : 'Example questions:'}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promptsContainer}
      >
        {prompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.promptButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onPromptSelect(prompt)}
          >
            <IconSymbol name="lightbulb" size={16} color={colors.primary} />
            <Text style={[styles.promptText, { color: colors.text }]}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  promptsContainer: {
    paddingRight: 16,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    maxWidth: 200,
  },
  promptText: {
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
});

export default ExamplePrompts;
