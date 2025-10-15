
import { AIMessage } from '@/types/ai';

export const createUserMessage = (content: string): AIMessage => ({
  id: Date.now().toString(),
  content: content.trim(),
  isUser: true,
  timestamp: new Date(),
});

export const createAIMessage = (content: string): AIMessage => ({
  id: (Date.now() + 1).toString(),
  content,
  isUser: false,
  timestamp: new Date(),
});

export const getErrorMessage = (language: 'sk' | 'en', error?: any): string => {
  console.error('AI Chat Error:', error);
  
  if (language === 'sk') {
    if (error?.message?.includes('fetch')) {
      return 'Problém s pripojením k internetu. Skontrolujte svoje pripojenie a skúste to znovu.';
    }
    if (error?.message?.includes('timeout')) {
      return 'Požiadavka trvala príliš dlho. Skúste to znovu.';
    }
    return 'Prepáčte, nastala chyba pri komunikácii s AI. Skúste to znovu.';
  } else {
    if (error?.message?.includes('fetch')) {
      return 'Network connection problem. Please check your connection and try again.';
    }
    if (error?.message?.includes('timeout')) {
      return 'Request took too long. Please try again.';
    }
    return 'Sorry, there was an error communicating with the AI. Please try again.';
  }
};

export const getWelcomeMessage = (language: 'sk' | 'en'): string => {
  return language === 'sk' 
    ? 'Ahoj! Som váš AI tutor pre gramatiku. Opýtajte sa ma na akékoľvek gramatické pravidlá v slovenčine alebo angličtine! Môžete sa pýtať na:\n\n• Gramatické pravidlá\n• Časovanie slovies\n• Správnu výslovnosť\n• Rozdiely medzi slovenčinou a angličtinou\n• Opravy chýb v textoch'
    : 'Hello! I\'m your AI grammar tutor. Ask me about any grammar rules in Slovak or English! You can ask about:\n\n• Grammar rules\n• Verb conjugations\n• Correct pronunciation\n• Differences between Slovak and English\n• Text corrections';
};

export const formatConversationHistory = (messages: AIMessage[], maxMessages: number = 10) => {
  return messages
    .slice(-maxMessages) // Keep last N messages for context
    .map(msg => ({
      role: msg.isUser ? 'user' : 'assistant' as const,
      content: msg.content
    }));
};
