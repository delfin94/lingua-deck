
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flashcard as FlashcardType, Deck } from '@/types/flashcard';
import { useFlashcards } from '@/hooks/useFlashcards';
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import Flashcard from '@/components/Flashcard';

export default function StudyScreen() {
  const { decks, getDueCards, reviewCard } = useFlashcards();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentCard, setCurrentCard] = useState<FlashcardType | null>(null);
  const [dueCards, setDueCards] = useState<FlashcardType[]>([]);
  const [studySession, setStudySession] = useState<{
    cardsStudied: number;
    correctAnswers: number;
  }>({ cardsStudied: 0, correctAnswers: 0 });

  const finishStudySession = useCallback(() => {
    Alert.alert(
      'Study Session Complete!',
      `You studied ${studySession.cardsStudied} cards with ${studySession.correctAnswers} correct answers.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            setSelectedDeck(null);
            setCurrentCard(null);
            setDueCards([]);
            setStudySession({ cardsStudied: 0, correctAnswers: 0 });
          }
        }
      ]
    );
  }, [studySession.cardsStudied, studySession.correctAnswers]);

  const selectDeck = useCallback((deck: Deck) => {
    console.log('Selecting deck for study:', deck.name);
    setSelectedDeck(deck);
    const cards = getDueCards(deck.id);
    setDueCards(cards);
    setCurrentCard(cards[0] || null);
    console.log('Selected deck for study:', deck.name, 'Due cards:', cards.length);
  }, [getDueCards]);

  const handleReview = useCallback((quality: number) => {
    if (!currentCard || !selectedDeck) return;

    console.log('Reviewing card:', currentCard.id, 'with quality:', quality);
    reviewCard(selectedDeck.id, currentCard.id, quality);
    
    const newDueCards = dueCards.slice(1);
    setDueCards(newDueCards);
    setCurrentCard(newDueCards[0] || null);
    
    setStudySession(prev => ({
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (quality >= 3 ? 1 : 0),
    }));

    if (newDueCards.length === 0) {
      finishStudySession();
    }
  }, [currentCard, selectedDeck, dueCards, reviewCard, finishStudySession]);

  const renderDeckSelector = () => (
    <View style={styles.deckSelector}>
      <Text style={[styles.title, { color: colors.text }]}>Choose a Deck to Study</Text>
      {decks.map((deck) => {
        const dueCount = getDueCards(deck.id).length;
        return (
          <TouchableOpacity
            key={deck.id}
            style={[styles.deckCard, { backgroundColor: colors.card }, dueCount === 0 && styles.deckCardDisabled]}
            onPress={() => dueCount > 0 && selectDeck(deck)}
            disabled={dueCount === 0}
          >
            <View style={styles.deckInfo}>
              <Text style={[styles.deckName, { color: colors.text }]}>{deck.name}</Text>
              <Text style={[styles.deckDescription, { color: colors.textSecondary }]}>{deck.description}</Text>
            </View>
            <View style={styles.dueInfo}>
              <Text style={[styles.dueCount, { color: colors.primary }, dueCount === 0 && { color: colors.textSecondary }]}>
                {dueCount}
              </Text>
              <Text style={[styles.dueLabel, { color: colors.textSecondary }]}>due</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStudySession = () => (
    <View style={styles.studyContainer}>
      <View style={[styles.studyHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            console.log('Going back to deck selector');
            setSelectedDeck(null);
            setCurrentCard(null);
            setDueCards([]);
            setStudySession({ cardsStudied: 0, correctAnswers: 0 });
          }}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.progressInfo}>
          <Text style={[styles.deckTitle, { color: colors.text }]}>{selectedDeck?.name}</Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {dueCards.length} cards remaining
          </Text>
        </View>
      </View>

      {currentCard ? (
        <View style={styles.cardContainer}>
          <Flashcard
            card={currentCard}
            onReview={handleReview}
            showButtons={true}
          />
        </View>
      ) : (
        <View style={styles.noCardsContainer}>
          <IconSymbol name="checkmark.circle" size={64} color={colors.success} />
          <Text style={[styles.noCardsText, { color: colors.text }]}>All cards reviewed!</Text>
          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: colors.primary }]}
            onPress={finishStudySession}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>Finish Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Study</Text>
        </View>

        <View style={styles.content}>
          {selectedDeck ? renderStudySession() : renderDeckSelector()}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingBottom: 120, // Extra padding for floating tab bar
  },
  deckSelector: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  deckCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  deckCardDisabled: {
    opacity: 0.5,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  deckDescription: {
    fontSize: 14,
  },
  dueInfo: {
    alignItems: 'center',
  },
  dueCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dueLabel: {
    fontSize: 12,
  },
  studyContainer: {
    flex: 1,
  },
  studyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noCardsText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  finishButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
