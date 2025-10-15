
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getColors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useFlashcards } from '@/hooks/useFlashcards';
import Flashcard from '@/components/Flashcard';
import { useTheme } from '@/contexts/ThemeContext';

export default function DeckDetailsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { deckId, deckName } = useLocalSearchParams<{ deckId: string; deckName: string }>();
  const { decks, addCardToDeck, getDueCards } = useFlashcards();
  const [showAddCard, setShowAddCard] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const deck = decks.find(d => d.id === deckId);
  const dueCards = deck ? getDueCards(deck.id) : [];

  if (!deck) {
    return (
      <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <View style={styles(colors).errorContainer}>
          <Text style={styles(colors).errorText}>Deck not found</Text>
          <TouchableOpacity
            style={[buttonStyles.primary, styles(colors).backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[commonStyles.buttonText, { color: colors.card }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddCard = () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Error', 'Please fill in both front and back of the card');
      return;
    }

    addCardToDeck(deck.id, front.trim(), back.trim());
    setFront('');
    setBack('');
    setShowAddCard(false);
    Alert.alert('Success', 'Card added to deck!');
  };

  const startStudy = () => {
    router.push('/(tabs)/study');
  };

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: deckName || 'Deck Details',
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles(colors).container} showsVerticalScrollIndicator={false}>
        <View style={styles(colors).header}>
          <View style={styles(colors).deckInfo}>
            <Text style={styles(colors).deckName}>{deck.name}</Text>
            <Text style={styles(colors).deckDescription}>{deck.description}</Text>
            
            <View style={styles(colors).deckMeta}>
              <View style={styles(colors).metaItem}>
                <IconSymbol name="book.stack" size={16} color={colors.primary} />
                <Text style={styles(colors).metaText}>{deck.cards.length} cards</Text>
              </View>
              
              <View style={styles(colors).metaItem}>
                <IconSymbol name="clock" size={16} color={colors.secondary} />
                <Text style={styles(colors).metaText}>{dueCards.length} due</Text>
              </View>
              
              <View style={styles(colors).metaItem}>
                <IconSymbol name="star" size={16} color={colors.accent} />
                <Text style={styles(colors).metaText}>{deck.language.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles(colors).actions}>
          <TouchableOpacity
            style={[buttonStyles.primary, styles(colors).actionButton, { backgroundColor: colors.primary }]}
            onPress={startStudy}
            disabled={dueCards.length === 0}
          >
            <IconSymbol name="brain" size={20} color={colors.card} />
            <Text style={[commonStyles.buttonText, styles(colors).actionButtonText, { color: colors.card }]}>
              {dueCards.length > 0 ? `Study ${dueCards.length} Cards` : 'No Cards Due'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.accent, styles(colors).actionButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowAddCard(true)}
          >
            <IconSymbol name="plus" size={20} color={colors.card} />
            <Text style={[commonStyles.buttonText, styles(colors).actionButtonText, { color: colors.card }]}>Add Card</Text>
          </TouchableOpacity>
        </View>

        <View style={styles(colors).section}>
          <Text style={styles(colors).sectionTitle}>Cards in this Deck</Text>
          
          {deck.cards.length === 0 ? (
            <View style={styles(colors).emptyState}>
              <IconSymbol name="book.stack" size={48} color={colors.textSecondary} />
              <Text style={styles(colors).emptyTitle}>No Cards Yet</Text>
              <Text style={styles(colors).emptyText}>Add your first flashcard to get started!</Text>
            </View>
          ) : (
            <View style={styles(colors).cardsGrid}>
              {deck.cards.map((card, index) => (
                <View key={card.id} style={styles(colors).cardPreview}>
                  <Flashcard card={card} />
                  <View style={styles(colors).cardInfo}>
                    <Text style={styles(colors).cardNumber}>Card {index + 1}</Text>
                    <Text style={styles(colors).cardStatus}>
                      {card.repetitions === 0 ? 'New' : 
                       card.nextReview <= new Date() ? 'Due' : 'Learned'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <Modal
          visible={showAddCard}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles(colors).modalContainer}>
              <View style={styles(colors).modalHeader}>
                <TouchableOpacity onPress={() => setShowAddCard(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles(colors).modalTitle}>Add New Card</Text>
                <TouchableOpacity onPress={handleAddCard}>
                  <Text style={styles(colors).saveButton}>Save</Text>
                </TouchableOpacity>
              </View>

              <View style={styles(colors).modalContent}>
                <View style={styles(colors).inputGroup}>
                  <Text style={styles(colors).inputLabel}>Front (Question)</Text>
                  <TextInput
                    style={styles(colors).input}
                    value={front}
                    onChangeText={setFront}
                    placeholder="Enter the question or prompt..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <View style={styles(colors).inputGroup}>
                  <Text style={styles(colors).inputLabel}>Back (Answer)</Text>
                  <TextInput
                    style={styles(colors).input}
                    value={back}
                    onChangeText={setBack}
                    placeholder="Enter the answer..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <TouchableOpacity
                  style={[buttonStyles.primary, styles(colors).addButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddCard}
                >
                  <Text style={[commonStyles.buttonText, { color: colors.card }]}>Add Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  backButton: {
    minWidth: 120,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  deckInfo: {
    alignItems: 'center',
  },
  deckName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  deckDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  deckMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardsGrid: {
    gap: 16,
  },
  cardPreview: {
    alignItems: 'center',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    marginTop: 8,
  },
  cardNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: 20,
  },
});
