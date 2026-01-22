import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/styles/theme';

// Simple screen components
const OnboardingScreen = ({ onComplete }) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Ionicons name="calendar" size={80} color={theme.colors.primary} />
      <Text style={styles.title}>Welcome to Cal Mood Tracker</Text>
      <Text style={styles.subtitle}>Balance work and life with wellness activities</Text>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LoginScreen = ({ onLogin, onSignUp }) => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={60} color={theme.colors.primary} />
        <Text style={styles.title}>Welcome Back</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSignUp}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const DashboardScreen = ({ onNavigate }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>Dashboard</Text>
      <TouchableOpacity onPress={() => onNavigate('menu')}>
        <Ionicons name="menu" size={28} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Mood</Text>
        <TouchableOpacity style={styles.moodButton} onPress={() => onNavigate('mood')}>
          <Text style={styles.moodEmoji}>😊</Text>
          <Text style={styles.moodText}>Good</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('calendar')}>
          <Ionicons name="calendar" size={24} color={theme.colors.primary} />
          <Text style={styles.actionText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('mood')}>
          <Ionicons name="happy" size={24} color={theme.colors.secondary} />
          <Text style={styles.actionText}>Mood Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('notes')}>
          <Ionicons name="document-text" size={24} color={theme.colors.accent} />
          <Text style={styles.actionText}>Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

const CalendarScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Calendar</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calendar View</Text>
        <Text style={styles.description}>Month, Week, and Day views available</Text>
        <Text style={styles.description}>Time blocks: 7 AM - 10 PM</Text>
      </View>
    </ScrollView>
  </View>
);

const MoodTrackerScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mood Tracker</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How are you feeling?</Text>
        <View style={styles.moodGrid}>
          {['😄', '🙂', '😐', '😔', '😢'].map((emoji, i) => (
            <TouchableOpacity key={i} style={styles.moodOption}>
              <Text style={styles.moodEmojiLarge}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  </View>
);

const NotesScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Notes</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Notes</Text>
        <Text style={styles.description}>Add tasks and notes here</Text>
      </View>
    </ScrollView>
  </View>
);

const MenuScreen = ({ onClose, onNavigate }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Menu</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('stats'); onClose(); }}>
        <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
        <Text style={styles.menuText}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('settings'); onClose(); }}>
        <Ionicons name="settings" size={24} color={theme.colors.primary} />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('profile'); onClose(); }}>
        <Ionicons name="person" size={24} color={theme.colors.primary} />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const StatsScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Statistics</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Stats</Text>
        <Text style={styles.statNumber}>15</Text>
        <Text style={styles.statLabel}>Events</Text>
        <Text style={styles.statNumber}>8</Text>
        <Text style={styles.statLabel}>Mood Entries</Text>
        <Text style={styles.statNumber}>7</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
    </ScrollView>
  </View>
);

const SettingsScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Settings</Text>
        <Text style={styles.description}>Customize colors, fonts, and preferences</Text>
      </View>
    </ScrollView>
  </View>
);

const ProfileScreen = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={{ width: 24 }} />
    </View>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Profile</Text>
        <Text style={styles.description}>Edit your profile information</Text>
      </View>
    </ScrollView>
  </View>
);

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [showMenu, setShowMenu] = useState(false);

  const navigate = (newScreen) => {
    setScreen(newScreen);
    setShowMenu(false);
  };

  if (showMenu) {
    return (
      <>
        <StatusBar style="auto" />
        <MenuScreen onClose={() => setShowMenu(false)} onNavigate={navigate} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      {screen === 'onboarding' && <OnboardingScreen onComplete={() => navigate('login')} />}
      {screen === 'login' && (
        <LoginScreen 
          onLogin={() => navigate('dashboard')} 
          onSignUp={() => navigate('dashboard')} 
        />
      )}
      {screen === 'dashboard' && <DashboardScreen onNavigate={navigate} />}
      {screen === 'calendar' && <CalendarScreen onBack={() => navigate('dashboard')} />}
      {screen === 'mood' && <MoodTrackerScreen onBack={() => navigate('dashboard')} />}
      {screen === 'notes' && <NotesScreen onBack={() => navigate('dashboard')} />}
      {screen === 'stats' && <StatsScreen onBack={() => navigate('dashboard')} />}
      {screen === 'settings' && <SettingsScreen onBack={() => navigate('dashboard')} />}
      {screen === 'profile' && <ProfileScreen onBack={() => navigate('dashboard')} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  moodButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  moodOption: {
    padding: theme.spacing.md,
  },
  moodEmojiLarge: {
    fontSize: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
  },
  actionText: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
  },
  menuText: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
