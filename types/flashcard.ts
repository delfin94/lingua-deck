
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
  createdAt: Date;
  lastReviewed?: Date;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: Date;
  language: 'sk' | 'en';
  category: string;
}

export interface StudySession {
  deckId: string;
  cardsStudied: number;
  correctAnswers: number;
  startTime: Date;
  endTime?: Date;
}

export interface Progress {
  totalCards: number;
  cardsLearned: number;
  cardsReviewing: number;
  cardsNew: number;
  streakDays: number;
  lastStudyDate?: Date;
}
