
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import ProgressChart from '@/components/ProgressChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFlashcards } from '@/hooks/useFlashcards';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProgressScreen() {
  const { decks, progress } = useFlashcards();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  // Get all flashcards from all decks
  const getAllFlashcards = () => {
    return decks.flatMap(deck => 
      deck.cards.map(card => ({ ...card, deckId: deck.id }))
    );
  };

  const flashcards = getAllFlashcards();

  const getDeckProgress = (deckId: string) => {
    const deckCards = flashcards.filter(card => card.deckId === deckId);
    const totalCards = deckCards.length;
    const studiedCards = deckCards.filter(card => card.lastReviewed).length;
    const masteredCards = deckCards.filter(card => 
      card.easeFactor && card.easeFactor > 2.5 && card.interval && card.interval > 7
    ).length;

    return {
      totalCards,
      studiedCards,
      masteredCards,
      accuracy: studiedCards > 0 ? Math.round((masteredCards / studiedCards) * 100) : 0,
    };
  };

  const getRecentActivity = () => {
    const recentCards = flashcards
      .filter(card => card.lastReviewed)
      .sort((a, b) => (b.lastReviewed?.getTime() || 0) - (a.lastReviewed?.getTime() || 0))
      .slice(0, 5);

    return recentCards.map(card => {
      const deck = decks.find(d => d.id === card.deckId);
      return {
        cardFront: card.front,
        deckName: deck?.name || 'Unknown Deck',
        reviewedAt: new Date(card.lastReviewed || 0),
      };
    });
  };

  const recentActivity = getRecentActivity();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Progress</Text>
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Overall Progress */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overall Progress</Text>
            <ProgressChart progress={progress} />
          </View>

          {/* Deck Progress */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Deck Progress</Text>
            {decks.length > 0 ? (
              decks.map(deck => {
                const deckProgress = getDeckProgress(deck.id);
                return (
                  <View key={deck.id} style={[styles.deckProgressCard, { backgroundColor: colors.card }]}>
                    <View style={styles.deckHeader}>
                      <Text style={[styles.deckName, { color: colors.text }]}>{deck.name}</Text>
                      <Text style={[styles.accuracyText, { color: colors.primary }]}>{deckProgress.accuracy}%</Text>
                    </View>
                    <View style={styles.progressStats}>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>{deckProgress.totalCards}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>{deckProgress.studiedCards}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Studied</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>{deckProgress.masteredCards}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mastered</Text>
                      </View>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            backgroundColor: colors.primary,
                            width: `${deckProgress.totalCards > 0 
                              ? (deckProgress.studiedCards / deckProgress.totalCards) * 100 
                              : 0}%` 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="folder" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No decks created yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Create your first deck to start tracking progress!</Text>
              </View>
            )}
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <View key={index} style={[styles.activityCard, { backgroundColor: colors.card }]}>
                  <IconSymbol name="clock" size={20} color={colors.primary} />
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityCardText, { color: colors.text }]}>{activity.cardFront}</Text>
                    <Text style={[styles.activityDeck, { color: colors.textSecondary }]}>{activity.deckName}</Text>
                  </View>
                  <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                    {activity.reviewedAt.toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="chart.bar" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No recent activity</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Start studying to see your progress!</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140, // Increased padding for floating tab bar
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  deckProgressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
  },
  accuracyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityCardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDeck: {
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});
