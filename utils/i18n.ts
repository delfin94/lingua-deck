
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    // Navigation
    decks: 'Decks',
    study: 'Study',
    progress: 'Progress',
    
    // Deck Management
    myDecks: 'My Decks',
    createDeck: 'Create New Deck',
    deckName: 'Deck Name',
    description: 'Description',
    language: 'Language',
    category: 'Category',
    english: 'English',
    slovak: 'Slovak',
    
    // Study
    selectDeckToStudy: 'Select a Deck to Study',
    cardsDue: 'cards due',
    noCardsDue: 'No cards due',
    allDone: 'All Done!',
    noCardsReview: 'No cards are due for review in this deck. Great job!',
    changeDeck: 'Change Deck',
    studied: 'Studied',
    correct: 'Correct',
    accuracy: 'Accuracy',
    
    // Flashcard Review
    tapToReveal: 'Tap to reveal',
    hard: 'Hard',
    medium: 'Medium',
    easy: 'Easy',
    
    // Progress
    studyProgress: 'Study Progress',
    totalCards: 'Total Cards',
    learned: 'Learned',
    reviewing: 'Reviewing',
    new: 'New',
    dayStreak: 'Day Streak',
    mastered: 'Mastered',
    deckProgress: 'Deck Progress',
    recentActivity: 'Recent Activity',
    studyTips: 'Study Tips',
    
    // Categories
    languageLearning: 'Language Learning',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
    science: 'Science',
    history: 'History',
    mathematics: 'Mathematics',
    literature: 'Literature',
    other: 'Other',
    
    // Common
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    create: 'Create',
    add: 'Add',
    back: 'Back',
    continue: 'Continue',
    
    // Messages
    deckCreated: 'Deck created successfully!',
    cardAdded: 'Card added to deck!',
    studySessionComplete: 'Study Session Complete!',
    fillAllFields: 'Please fill in all fields',
    confirmDelete: 'Are you sure you want to delete this deck?',
  },
  sk: {
    // Navigation
    decks: 'Balíčky',
    study: 'Štúdium',
    progress: 'Pokrok',
    
    // Deck Management
    myDecks: 'Moje Balíčky',
    createDeck: 'Vytvoriť Nový Balíček',
    deckName: 'Názov Balíčka',
    description: 'Popis',
    language: 'Jazyk',
    category: 'Kategória',
    english: 'Angličtina',
    slovak: 'Slovenčina',
    
    // Study
    selectDeckToStudy: 'Vyberte Balíček na Štúdium',
    cardsDue: 'kariet na opakovanie',
    noCardsDue: 'Žiadne karty na opakovanie',
    allDone: 'Všetko Hotovo!',
    noCardsReview: 'V tomto balíčku nie sú žiadne karty na opakovanie. Výborne!',
    changeDeck: 'Zmeniť Balíček',
    studied: 'Študované',
    correct: 'Správne',
    accuracy: 'Presnosť',
    
    // Flashcard Review
    tapToReveal: 'Ťuknite pre odhalenie',
    hard: 'Ťažké',
    medium: 'Stredné',
    easy: 'Ľahké',
    
    // Progress
    studyProgress: 'Pokrok v Štúdiu',
    totalCards: 'Celkom Kariet',
    learned: 'Naučené',
    reviewing: 'Opakované',
    new: 'Nové',
    dayStreak: 'Denná Séria',
    mastered: 'Zvládnuté',
    deckProgress: 'Pokrok Balíčkov',
    recentActivity: 'Nedávna Aktivita',
    studyTips: 'Tipy na Štúdium',
    
    // Categories
    languageLearning: 'Učenie Jazykov',
    grammar: 'Gramatika',
    vocabulary: 'Slovná Zásoba',
    science: 'Veda',
    history: 'História',
    mathematics: 'Matematika',
    literature: 'Literatura',
    other: 'Iné',
    
    // Common
    cancel: 'Zrušiť',
    save: 'Uložiť',
    delete: 'Vymazať',
    create: 'Vytvoriť',
    add: 'Pridať',
    back: 'Späť',
    continue: 'Pokračovať',
    
    // Messages
    deckCreated: 'Balíček úspešne vytvorený!',
    cardAdded: 'Karta pridaná do balíčka!',
    studySessionComplete: 'Štúdijná Relácia Dokončená!',
    fillAllFields: 'Prosím vyplňte všetky polia',
    confirmDelete: 'Ste si istí, že chcete vymazať tento balíček?',
  },
});

// Set default locale
i18n.defaultLocale = 'en';
i18n.locale = 'en';

export default i18n;
