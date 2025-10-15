
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getColors } from '../styles/commonStyles';
import { Deck } from '../types/flashcard';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';

interface DeckListProps {
  decks: Deck[];
  onDeckPress: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export default function DeckList({ decks, onDeckPress, onDeleteDeck }: DeckListProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const handleDeletePress = (deck: Deck) => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deck.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteDeck(deck.id) },
      ]
    );
  };

  if (decks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <IconSymbol name="book.closed" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Decks Yet</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Create your first flashcard deck to get started!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {decks.map((deck) => (
        <View key={deck.id} style={[styles.deckCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.deckContent}
            onPress={() => onDeckPress(deck)}
          >
            <View style={styles.deckHeader}>
              <Text style={[styles.deckName, { color: colors.text }]}>{deck.name}</Text>
              <View style={[styles.languageTag, { backgroundColor: colors.primary }]}>
                <Text style={[styles.languageText, { color: colors.card }]}>
                  {deck.language.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.deckDescription, { color: colors.textSecondary }]}>{deck.description}</Text>
            
            <View style={styles.deckStats}>
              <View style={styles.statItem}>
                <IconSymbol name="rectangle.stack" size={16} color={colors.primary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{deck.cards.length} cards</Text>
              </View>
              
              <View style={styles.statItem}>
                <IconSymbol name="tag" size={16} color={colors.secondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{deck.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(deck)}
          >
            <IconSymbol name="trash" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  deckCard: {
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  deckContent: {
    flex: 1,
    padding: 16,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deckDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  deckStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
