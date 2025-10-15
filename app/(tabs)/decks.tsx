
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import DeckList from '@/components/DeckList';
import DeckCreationForm from '@/components/DeckCreationForm';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Deck } from '@/types/flashcard';

export default function DecksScreen() {
  const router = useRouter();
  const { decks, createDeck, deleteDeck } = useFlashcards();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateDeck = (name: string, description: string, language: 'sk' | 'en', category: string) => {
    const deckId = createDeck(name, description, language, category);
    setShowCreateForm(false);
    console.log('Created deck with ID:', deckId);
  };

  const handleDeckPress = (deck: Deck) => {
    console.log('Selected deck:', deck.name);
    router.push({
      pathname: '/deck-details',
      params: { deckId: deck.id, deckName: deck.name }
    });
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Decks</Text>
          <TouchableOpacity
            onPress={() => setShowCreateForm(true)}
            style={[styles.headerButton, { backgroundColor: colors.card }]}
          >
            <IconSymbol name="plus" color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <DeckList
            decks={decks}
            onDeckPress={handleDeckPress}
            onDeleteDeck={deleteDeck}
          />
        </View>

        <Modal
          visible={showCreateForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <DeckCreationForm
              onCreateDeck={handleCreateDeck}
              onCancel={() => setShowCreateForm(false)}
            />
          </SafeAreaView>
        </Modal>
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
  headerButton: {
    padding: 8,
    borderRadius: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120, // Extra padding for floating tab bar
  },
});
