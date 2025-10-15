
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface DeckCreationFormProps {
  onCreateDeck: (name: string, description: string, language: 'sk' | 'en', category: string) => void;
  onCancel: () => void;
}

export default function DeckCreationForm({ onCreateDeck, onCancel }: DeckCreationFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<'sk' | 'en'>('en');
  const [category, setCategory] = useState('');

  const categories = [
    'Language Learning',
    'Grammar',
    'Vocabulary',
    'Science',
    'History',
    'Mathematics',
    'Literature',
    'Other',
  ];

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    onCreateDeck(name.trim(), description.trim(), language, category);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Deck</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deck Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter deck name..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what this deck is about..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && styles.languageOptionSelected,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text
                style={[
                  styles.languageText,
                  language === 'en' && styles.languageTextSelected,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'sk' && styles.languageOptionSelected,
              ]}
              onPress={() => setLanguage('sk')}
            >
              <Text
                style={[
                  styles.languageText,
                  language === 'sk' && styles.languageTextSelected,
                ]}
              >
                Slovak
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryOption,
                  category === cat && styles.categoryOptionSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={[buttonStyles.primary, styles.createButton]} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Create Deck</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  languageOption: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  languageTextSelected: {
    color: colors.card,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.card,
  },
  categoryOptionSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryTextSelected: {
    color: colors.card,
  },
  createButton: {
    marginTop: 16,
  },
});
