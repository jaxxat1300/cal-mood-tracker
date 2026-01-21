import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const StatsScreen = () => {
  const navigation = useNavigation();
  const { stats, moodEntries, events, wellnessActivities } = useApp();

  const getMoodDistribution = () => {
    const distribution = {
      excellent: 0,
      good: 0,
      okay: 0,
      poor: 0,
      terrible: 0,
    };

    moodEntries.forEach(entry => {
      if (distribution.hasOwnProperty(entry.mood)) {
        distribution[entry.mood]++;
      }
    });

    return distribution;
  };

  const getWeeklyStats = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const weekMoods = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const weekEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    const weekWellness = wellnessActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart && activityDate <= weekEnd;
    });

    return {
      moods: weekMoods.length,
      events: weekEvents.length,
      wellness: weekWellness.length,
    };
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthMoods = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart;
    });

    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart;
    });

    const monthWellness = wellnessActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= monthStart;
    });

    return {
      moods: monthMoods.length,
      events: monthEvents.length,
      wellness: monthWellness.length,
    };
  };

  const moodDistribution = getMoodDistribution();
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 'N/A';
    
    const moodValues = {
      excellent: 5,
      good: 4,
      okay: 3,
      poor: 2,
      terrible: 1,
    };

    const total = moodEntries.reduce((sum, entry) => {
      return sum + (moodValues[entry.mood] || 3);
    }, 0);

    const average = total / moodEntries.length;
    const rounded = Math.round(average);

    const moodLabels = {
      5: 'Excellent',
      4: 'Good',
      3: 'Okay',
      2: 'Poor',
      1: 'Terrible',
    };

    return moodLabels[rounded] || 'Okay';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Overall Stats */}
        <Card style={styles.overallCard}>
          <Text style={styles.cardTitle}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={32} color={theme.colors.primary} />
              <Text style={styles.statNumber}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="fitness" size={32} color={theme.colors.secondary} />
              <Text style={styles.statNumber}>{stats.totalWellnessActivities}</Text>
              <Text style={styles.statLabel}>Wellness Activities</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="happy" size={32} color={theme.colors.accent} />
              <Text style={styles.statNumber}>{stats.totalMoodEntries}</Text>
              <Text style={styles.statLabel}>Mood Entries</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={32} color={theme.colors.warning} />
              <Text style={styles.statNumber}>{stats.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </Card>

        {/* Average Mood */}
        <Card style={styles.moodCard}>
          <Text style={styles.cardTitle}>Average Mood</Text>
          <View style={styles.averageMoodContainer}>
            <Text style={styles.averageMoodValue}>{getAverageMood()}</Text>
            <Text style={styles.averageMoodSubtext}>
              Based on {stats.totalMoodEntries} entries
            </Text>
          </View>
        </Card>

        {/* Mood Distribution */}
        <Card style={styles.distributionCard}>
          <Text style={styles.cardTitle}>Mood Distribution</Text>
          <View style={styles.distributionList}>
            {Object.entries(moodDistribution).map(([mood, count]) => {
              const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const moodEmojis = {
                excellent: '😄',
                good: '🙂',
                okay: '😐',
                poor: '😔',
                terrible: '😢',
              };
              const moodColors = {
                excellent: theme.colors.success,
                good: theme.colors.accent,
                okay: theme.colors.warning,
                poor: theme.colors.secondary,
                terrible: theme.colors.error,
              };

              return (
                <View key={mood} style={styles.distributionItem}>
                  <View style={styles.distributionLeft}>
                    <Text style={styles.distributionEmoji}>{moodEmojis[mood]}</Text>
                    <Text style={styles.distributionLabel}>
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.distributionRight}>
                    <View style={styles.distributionBarContainer}>
                      <View
                        style={[
                          styles.distributionBar,
                          { width: `${percentage}%`, backgroundColor: moodColors[mood] },
                        ]}
                      />
                    </View>
                    <Text style={styles.distributionCount}>{count}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Weekly Stats */}
        <Card style={styles.weeklyCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.weeklyStats}>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>{weeklyStats.moods}</Text>
              <Text style={styles.weeklyStatLabel}>Mood Entries</Text>
            </View>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>{weeklyStats.events}</Text>
              <Text style={styles.weeklyStatLabel}>Events</Text>
            </View>
            <View style={styles.weeklyStatItem}>
              <Text style={styles.weeklyStatNumber}>{weeklyStats.wellness}</Text>
              <Text style={styles.weeklyStatLabel}>Wellness Activities</Text>
            </View>
          </View>
        </Card>

        {/* Monthly Stats */}
        <Card style={styles.monthlyCard}>
          <Text style={styles.cardTitle}>This Month</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatNumber}>{monthlyStats.moods}</Text>
              <Text style={styles.monthlyStatLabel}>Mood Entries</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatNumber}>{monthlyStats.events}</Text>
              <Text style={styles.monthlyStatLabel}>Events</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatNumber}>{monthlyStats.wellness}</Text>
              <Text style={styles.monthlyStatLabel}>Wellness Activities</Text>
            </View>
          </View>
        </Card>

        {/* App Usage */}
        <Card style={styles.usageCard}>
          <Text style={styles.cardTitle}>App Usage</Text>
          <View style={styles.usageItem}>
            <Ionicons name="log-in-outline" size={24} color={theme.colors.textLight} />
            <View style={styles.usageInfo}>
              <Text style={styles.usageLabel}>Total Sign-ins</Text>
              <Text style={styles.usageValue}>{stats.totalSignIns}</Text>
            </View>
          </View>
          {stats.lastSignIn && (
            <View style={styles.usageItem}>
              <Ionicons name="time-outline" size={24} color={theme.colors.textLight} />
              <View style={styles.usageInfo}>
                <Text style={styles.usageLabel}>Last Sign-in</Text>
                <Text style={styles.usageValue}>
                  {format(new Date(stats.lastSignIn), 'MMM d, yyyy • h:mm a')}
                </Text>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  overallCard: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  moodCard: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  averageMoodContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  averageMoodValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  averageMoodSubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  distributionCard: {
    marginBottom: theme.spacing.md,
  },
  distributionList: {
    marginTop: theme.spacing.sm,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  distributionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  distributionEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  distributionLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  distributionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    width: 30,
    textAlign: 'right',
  },
  weeklyCard: {
    marginBottom: theme.spacing.md,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  weeklyStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  monthlyCard: {
    marginBottom: theme.spacing.md,
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  monthlyStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  usageCard: {
    marginBottom: theme.spacing.md,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  usageInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  usageLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default StatsScreen;
