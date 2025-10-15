
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { getColors } from '../styles/commonStyles';
import { Flashcard as FlashcardType } from '../types/flashcard';
import { useTheme } from '@/contexts/ThemeContext';

interface FlashcardProps {
  card: FlashcardType;
  onReview?: (quality: number) => void;
  showButtons?: boolean;
}

export default function Flashcard({ card, onReview, showButtons = false }: FlashcardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleReview = (quality: number) => {
    if (onReview) {
      onReview(quality);
    }
    setIsFlipped(false);
    flipAnimation.setValue(0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
        <Animated.View style={[
          styles.card, 
          styles.cardFront, 
          frontAnimatedStyle,
          { backgroundColor: colors.card, borderColor: colors.primary }
        ]}>
          <Text style={[styles.cardText, { color: colors.text }]}>{card.front}</Text>
          <Text style={[styles.tapHint, { color: colors.textSecondary }]}>Tap to reveal</Text>
        </Animated.View>
        
        <Animated.View style={[
          styles.card, 
          styles.cardBack, 
          backAnimatedStyle,
          { backgroundColor: colors.accent, borderColor: colors.accent }
        ]}>
          <Text style={[styles.cardText, { color: isDark ? colors.text : colors.card }]}>{card.back}</Text>
        </Animated.View>
      </TouchableOpacity>

      {showButtons && isFlipped && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.reviewButton, styles.hardButton, { backgroundColor: colors.error }]}
            onPress={() => handleReview(1)}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>Hard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.reviewButton, styles.mediumButton, { backgroundColor: colors.warning }]}
            onPress={() => handleReview(3)}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>Medium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.reviewButton, styles.easyButton, { backgroundColor: colors.success }]}
            onPress={() => handleReview(5)}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>Easy</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    width: 300,
    height: 200,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  cardFront: {
    borderWidth: 2,
  },
  cardBack: {
    borderWidth: 2,
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  tapHint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  reviewButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  hardButton: {},
  mediumButton: {},
  easyButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
