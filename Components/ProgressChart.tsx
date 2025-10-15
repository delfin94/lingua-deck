
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getColors } from '../styles/commonStyles';
import { Progress } from '../types/flashcard';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressChartProps {
  progress: Progress;
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { width } = Dimensions.get('window');
  const chartSize = Math.min(width - 80, 200);
  const strokeWidth = 12;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const learnedPercentage = progress.totalCards > 0 ? (progress.cardsLearned / progress.totalCards) * 100 : 0;
  const reviewingPercentage = progress.totalCards > 0 ? (progress.cardsReviewing / progress.totalCards) * 100 : 0;
  const newPercentage = progress.totalCards > 0 ? (progress.cardsNew / progress.totalCards) * 100 : 0;

  const learnedOffset = circumference - (learnedPercentage / 100) * circumference;
  const reviewingOffset = circumference - (reviewingPercentage / 100) * circumference;
  const newOffset = circumference - (newPercentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Study Progress</Text>
      
      <View style={styles.chartContainer}>
        <View style={[styles.chart, { width: chartSize, height: chartSize }]}>
          {/* Background circle */}
          <View style={styles.svgContainer}>
            <View
              style={[
                styles.circle,
                {
                  width: chartSize,
                  height: chartSize,
                  borderRadius: chartSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: colors.border,
                },
              ]}
            />
            
            {/* Learned cards circle */}
            {learnedPercentage > 0 && (
              <View
                style={[
                  styles.circle,
                  styles.progressCircle,
                  {
                    width: chartSize,
                    height: chartSize,
                    borderRadius: chartSize / 2,
                    borderWidth: strokeWidth,
                    borderColor: colors.success,
                    transform: [{ rotate: '-90deg' }],
                  },
                ]}
              />
            )}
          </View>
          
          <View style={styles.centerContent}>
            <Text style={[styles.centerNumber, { color: colors.text }]}>{progress.totalCards}</Text>
            <Text style={[styles.centerLabel, { color: colors.textSecondary }]}>Total Cards</Text>
          </View>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Learned: {progress.cardsLearned}</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Reviewing: {progress.cardsReviewing}</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.accent }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>New: {progress.cardsNew}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{progress.streakDays}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {progress.totalCards > 0 ? Math.round(learnedPercentage) : 0}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mastered</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chart: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  progressCircle: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  centerLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  legend: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
});
