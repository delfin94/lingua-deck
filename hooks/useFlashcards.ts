
import { useState, useEffect } from 'react';
import { Deck, Flashcard, StudySession, Progress } from '../types/flashcard';

// Spaced repetition algorithm (SM-2)
const calculateNextReview = (
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): { nextInterval: number; nextEaseFactor: number; nextRepetitions: number } => {
  let nextEaseFactor = easeFactor;
  let nextRepetitions = repetitions;
  let nextInterval = interval;

  if (quality >= 3) {
    if (repetitions === 0) {
      nextInterval = 1;
    } else if (repetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetitions = repetitions + 1;
  } else {
    nextRepetitions = 0;
    nextInterval = 1;
  }

  nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3;
  }

  return { nextInterval, nextEaseFactor, nextRepetitions };
};

export const useFlashcards = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [progress, setProgress] = useState<Progress>({
    totalCards: 0,
    cardsLearned: 0,
    cardsReviewing: 0,
    cardsNew: 0,
    streakDays: 0,
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleDecks: Deck[] = [
      {
        id: '1',
        name: 'Basic Slovak Vocabulary',
        description: 'Essential Slovak words for beginners',
        language: 'sk',
        category: 'Language Learning',
        createdAt: new Date(),
        cards: [
          {
            id: '1-1',
            front: 'Hello',
            back: 'Ahoj',
            difficulty: 'easy',
            nextReview: new Date(),
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            createdAt: new Date(),
          },
          {
            id: '1-2',
            front: 'Thank you',
            back: 'Ďakujem',
            difficulty: 'medium',
            nextReview: new Date(),
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            createdAt: new Date(),
          },
          {
            id: '1-3',
            front: 'Good morning',
            back: 'Dobré ráno',
            difficulty: 'medium',
            nextReview: new Date(),
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            createdAt: new Date(),
          },
        ],
      },
      {
        id: '2',
        name: 'English Grammar',
        description: 'Common English grammar rules',
        language: 'en',
        category: 'Grammar',
        createdAt: new Date(),
        cards: [
          {
            id: '2-1',
            front: 'Past tense of "go"',
            back: 'went',
            difficulty: 'easy',
            nextReview: new Date(),
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            createdAt: new Date(),
          },
          {
            id: '2-2',
            front: 'Plural of "child"',
            back: 'children',
            difficulty: 'medium',
            nextReview: new Date(),
            interval: 1,
            repetitions: 0,
            easeFactor: 2.5,
            createdAt: new Date(),
          },
        ],
      },
    ];
    setDecks(sampleDecks);
    updateProgress(sampleDecks);
  }, []);

  const updateProgress = (currentDecks: Deck[]) => {
    console.log('Updating progress with decks:', currentDecks.length);
    
    // Get all cards from all decks
    const allCards = currentDecks.flatMap(deck => deck.cards);
    
    const totalCards = allCards.length;
    const cardsLearned = allCards.filter(card => 
      card.repetitions > 0 && card.easeFactor > 2.5 && card.interval > 7
    ).length;
    const cardsReviewing = allCards.filter(card => 
      card.repetitions > 0 && card.nextReview <= new Date()
    ).length;
    const cardsNew = allCards.filter(card => card.repetitions === 0).length;

    const newProgress: Progress = {
      totalCards,
      cardsLearned,
      cardsReviewing,
      cardsNew,
      streakDays: 0, // TODO: Calculate streak based on study history
    };

    console.log('Progress updated:', newProgress);
    setProgress(newProgress);
  };

  const createDeck = (name: string, description: string, language: 'sk' | 'en', category: string) => {
    console.log('Creating deck:', name);
    const newDeck: Deck = {
      id: Date.now().toString(),
      name,
      description,
      language,
      category,
      cards: [],
      createdAt: new Date(),
    };
    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    updateProgress(updatedDecks);
    return newDeck.id;
  };

  const addCardToDeck = (deckId: string, front: string, back: string) => {
    console.log('Adding card to deck:', deckId, front);
    const newCard: Flashcard = {
      id: `${deckId}-${Date.now()}`,
      front,
      back,
      difficulty: 'medium',
      nextReview: new Date(),
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      createdAt: new Date(),
    };

    const updatedDecks = decks.map(deck => {
      if (deck.id === deckId) {
        return { ...deck, cards: [...deck.cards, newCard] };
      }
      return deck;
    });
    setDecks(updatedDecks);
    updateProgress(updatedDecks);
  };

  const reviewCard = (deckId: string, cardId: string, quality: number) => {
    console.log('Reviewing card:', cardId, 'quality:', quality);
    const updatedDecks = decks.map(deck => {
      if (deck.id === deckId) {
        const updatedCards = deck.cards.map(card => {
          if (card.id === cardId) {
            const { nextInterval, nextEaseFactor, nextRepetitions } = calculateNextReview(
              quality,
              card.repetitions,
              card.easeFactor,
              card.interval
            );

            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + nextInterval);

            return {
              ...card,
              interval: nextInterval,
              easeFactor: nextEaseFactor,
              repetitions: nextRepetitions,
              nextReview,
              lastReviewed: new Date(),
            };
          }
          return card;
        });
        return { ...deck, cards: updatedCards };
      }
      return deck;
    });
    setDecks(updatedDecks);
    updateProgress(updatedDecks);
  };

  // Added updateFlashcard function for backward compatibility
  const updateFlashcard = (cardId: string, quality: number) => {
    console.log('Updating flashcard:', cardId, 'quality:', quality);
    
    // Find the deck that contains this card
    const deckWithCard = decks.find(deck => 
      deck.cards.some(card => card.id === cardId)
    );
    
    if (deckWithCard) {
      reviewCard(deckWithCard.id, cardId, quality);
    } else {
      console.warn('Card not found:', cardId);
    }
  };

  const getDueCards = (deckId: string): Flashcard[] => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return [];
    
    const now = new Date();
    return deck.cards.filter(card => card.nextReview <= now);
  };

  const startStudySession = (deckId: string) => {
    console.log('Starting study session for deck:', deckId);
    const session: StudySession = {
      deckId,
      cardsStudied: 0,
      correctAnswers: 0,
      startTime: new Date(),
    };
    setCurrentSession(session);
  };

  const endStudySession = () => {
    if (currentSession) {
      console.log('Ending study session');
      setCurrentSession({ ...currentSession, endTime: new Date() });
    }
  };

  const deleteDeck = (deckId: string) => {
    console.log('Deleting deck:', deckId);
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    updateProgress(updatedDecks);
  };

  // Get all flashcards from all decks (for compatibility)
  const flashcards = decks.flatMap(deck => 
    deck.cards.map(card => ({ ...card, deckId: deck.id }))
  );

  return {
    decks,
    flashcards, // Added for backward compatibility
    progress,
    currentSession,
    createDeck,
    addCardToDeck,
    reviewCard,
    updateFlashcard, // Added for backward compatibility
    getDueCards,
    startStudySession,
    endStudySession,
    deleteDeck,
  };
};
