import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import Card from '../components/Card';
import { format } from 'date-fns';

const NotificationsScreen = () => {
  const navigation = useNavigation();

  // Mock notifications - in a real app, these would come from a backend or local storage
  const notifications = [
    {
      id: '1',
      type: 'event',
      title: 'Team Meeting',
      message: 'Your event "Team Meeting" starts in 15 minutes',
      time: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'wellness',
      title: 'Wellness Reminder',
      message: 'Time for your 5-minute meditation',
      time: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      type: 'mood',
      title: 'Mood Check-in',
      message: 'Don\'t forget to track your mood today!',
      time: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: '4',
      type: 'streak',
      title: 'Great Job!',
      message: 'You\'ve maintained a 7-day streak!',
      time: new Date(Date.now() - 172800000),
      read: true,
    },
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      event: 'calendar',
      wellness: 'fitness',
      mood: 'happy',
      streak: 'flame',
    };
    return icons[type] || 'notifications';
  };

  const getNotificationColor = (type) => {
    const colors = {
      event: theme.colors.primary,
      wellness: theme.colors.secondary,
      mood: theme.colors.accent,
      streak: theme.colors.warning,
    };
    return colors[type] || theme.colors.textMuted;
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </Card>
        ) : (
          notifications.map(notification => (
            <Card
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
            >
              <View style={styles.notificationContent}>
                <View
                  style={[
                    styles.notificationIconContainer,
                    { backgroundColor: getNotificationColor(notification.type) + '30' },
                  ]}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {format(notification.time, 'MMM d, yyyy • h:mm a')}
                  </Text>
                </View>
                {!notification.read && (
                  <View style={styles.unreadDot} />
                )}
              </View>
            </Card>
          ))
        )}
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
  clearButton: {
    padding: theme.spacing.xs,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  notificationCard: {
    marginBottom: theme.spacing.md,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    marginTop: 4,
  },
});

export default NotificationsScreen;
