import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { stats, moodEntries, events, wellnessActivities } = useApp();
  const [currentDate] = useState(new Date());

  const todayMood = moodEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === currentDate.toDateString();
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === currentDate.toDateString();
  });

  const todayWellness = wellnessActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.toDateString() === currentDate.toDateString();
  });

  const getMoodEmoji = (mood) => {
    const moodMap = {
      'excellent': '😄',
      'good': '🙂',
      'okay': '😐',
      'poor': '😔',
      'terrible': '😢',
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      'excellent': theme.colors.success,
      'good': theme.colors.accent,
      'okay': theme.colors.warning,
      'poor': theme.colors.secondary,
      'terrible': theme.colors.error,
    };
    return colorMap[mood] || theme.colors.textMuted;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
          <Text style={styles.date}>{format(currentDate, 'EEEE, MMMM d')}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notificationButton}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Mood */}
        <Card style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.cardTitle}>Today's Mood</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Mood')}>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
          {todayMood ? (
            <View style={styles.moodContent}>
              <View style={[styles.moodEmojiContainer, { backgroundColor: getMoodColor(todayMood.mood) + '30' }]}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(todayMood.mood)}</Text>
              </View>
              <View style={styles.moodInfo}>
                <Text style={styles.moodText}>{todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1)}</Text>
                {todayMood.note && (
                  <Text style={styles.moodNote} numberOfLines={2}>{todayMood.note}</Text>
                )}
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addMoodButton}
              onPress={() => navigation.navigate('Mood')}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.addMoodText}>Add your mood for today</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="calendar" size={32} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="fitness" size={32} color={theme.colors.secondary} />
            <Text style={styles.statNumber}>{stats.totalWellnessActivities}</Text>
            <Text style={styles.statLabel}>Wellness</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={32} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{stats.streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
        </View>

        {/* Today's Schedule */}
        <Card style={styles.scheduleCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
          {todayEvents.length > 0 || todayWellness.length > 0 ? (
            <View style={styles.scheduleList}>
              {todayEvents.slice(0, 3).map(event => (
                <View key={event.id} style={styles.scheduleItem}>
                  <View style={[styles.scheduleDot, { backgroundColor: theme.colors.primary }]} />
                  <View style={styles.scheduleContent}>
                    <Text style={styles.scheduleTitle}>{event.title}</Text>
                    {event.time && (
                      <Text style={styles.scheduleTime}>{event.time}</Text>
                    )}
                  </View>
                </View>
              ))}
              {todayWellness.slice(0, 3).map(activity => (
                <View key={activity.id} style={styles.scheduleItem}>
                  <View style={[styles.scheduleDot, { backgroundColor: theme.colors.secondary }]} />
                  <View style={styles.scheduleContent}>
                    <Text style={styles.scheduleTitle}>{activity.title}</Text>
                    {activity.time && (
                      <Text style={styles.scheduleTime}>{activity.time}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addScheduleButton}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.addScheduleText}>No events today. Add one?</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Calendar')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.colors.primaryLight + '30' }]}>
                <Ionicons name="add" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Add Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Calendar')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.colors.secondaryLight + '30' }]}>
                <Ionicons name="fitness" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={styles.actionLabel}>Wellness</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Stats')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.colors.accentLight + '30' }]}>
                <Ionicons name="stats-chart" size={24} color={theme.colors.accent} />
              </View>
              <Text style={styles.actionLabel}>View Stats</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
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
  menuButton: {
    padding: theme.spacing.xs,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  date: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  notificationButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  moodCard: {
    marginBottom: theme.spacing.md,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodInfo: {
    flex: 1,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  moodNote: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  addMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  addMoodText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    width: (width - theme.spacing.md * 4) / 3,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  scheduleCard: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scheduleList: {
    gap: theme.spacing.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.md,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  addScheduleText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: 16,
  },
  actionsCard: {
    marginBottom: theme.spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default DashboardScreen;
