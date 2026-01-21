import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import Card from '../components/Card';

const HowToUseScreen = () => {
  const navigation = useNavigation();

  const features = [
    {
      icon: 'calendar',
      title: 'Calendar Management',
      description: 'View your schedule in month, week, or day view. Add events and wellness activities to keep track of your day.',
      steps: [
        'Tap the Calendar tab to view your schedule',
        'Switch between Month, Week, and Day views',
        'Tap the + button to add a new event or wellness activity',
        'Select a date and time for your event',
      ],
    },
    {
      icon: 'happy',
      title: 'Mood Tracking',
      description: 'Track your daily mood to monitor your mental well-being and see patterns over time.',
      steps: [
        'Go to the Mood tab',
        'Select how you\'re feeling today',
        'Add an optional note about your mood',
        'View your mood history and insights',
      ],
    },
    {
      icon: 'fitness',
      title: 'Wellness Activities',
      description: 'Incorporate 5-minute wellness activities into your busy schedule for better work-life balance.',
      steps: [
        'Add wellness activities from the Calendar screen',
        'Schedule them at convenient times',
        'Track your consistency in the Stats page',
      ],
    },
    {
      icon: 'stats-chart',
      title: 'Statistics & Insights',
      description: 'View your app usage statistics, mood trends, and track your progress.',
      steps: [
        'Open the menu and tap Stats',
        'View your overall statistics',
        'See your mood distribution and trends',
        'Track your weekly and monthly activity',
      ],
    },
    {
      icon: 'document-text',
      title: 'Notes',
      description: 'Keep track of tasks and general notes alongside your calendar.',
      steps: [
        'Go to the Notes tab',
        'Add new notes or tasks',
        'Organize your thoughts and reminders',
      ],
    },
    {
      icon: 'time',
      title: 'Time Blocks',
      description: 'Plan your day with time blocks from 7 AM to 10 PM in 30-minute intervals.',
      steps: [
        'Switch to Day view in Calendar',
        'See your schedule organized by Morning, Work Time, and Evening',
        'Tap on a time block to add an event',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Use</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Welcome to Cal Mood Tracker!</Text>
          <Text style={styles.introText}>
            This app helps you balance work and life by incorporating wellness activities into your daily schedule and tracking your mood.
          </Text>
        </Card>

        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </View>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <View style={styles.stepsContainer}>
              {feature.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Success</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Set aside 5 minutes daily for wellness activities</Text>
            <Text style={styles.tipItem}>• Track your mood at the same time each day</Text>
            <Text style={styles.tipItem}>• Review your stats weekly to see patterns</Text>
            <Text style={styles.tipItem}>• Use notes to jot down thoughts and tasks</Text>
            <Text style={styles.tipItem}>• Customize your calendar colors to match your style</Text>
          </View>
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
  introCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  introText: {
    fontSize: 16,
    color: theme.colors.textLight,
    lineHeight: 24,
  },
  featureCard: {
    marginBottom: theme.spacing.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  featureDescription: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  stepsContainer: {
    marginTop: theme.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  tipsCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.accentLight + '30',
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipsList: {
    gap: theme.spacing.sm,
  },
  tipItem: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
});

export default HowToUseScreen;
