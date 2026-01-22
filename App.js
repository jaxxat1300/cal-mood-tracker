// Enhanced prototype with more functionality and calming purple design
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/styles/theme';

// Simple data storage (using state - in real app would use AsyncStorage)
let appData = {
  moods: [],
  events: [],
  notes: [],
};

// Onboarding Screen
const OnboardingScreen = ({ onComplete }) => (
  <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
    <View style={styles.content}>
      <View style={styles.iconCircle}>
        <Ionicons name="calendar" size={80} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>Welcome to Cal Mood Tracker</Text>
      <Text style={styles.subtitle}>Balance work and life with wellness activities</Text>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

// Login Screen
const LoginScreen = ({ onLogin, onSignUp }) => (
  <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.iconCircleSmall}>
          <Ionicons name="calendar" size={60} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSignUp}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  </LinearGradient>
);

// Dashboard Screen
const DashboardScreen = ({ onNavigate, currentMood, eventCount, noteCount }) => (
  <View style={styles.container}>
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerGreeting}>Good {getTimeOfDay()}</Text>
          <Text style={styles.headerSubtitle}>Today is a great day</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate('menu')}>
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Mood</Text>
        <TouchableOpacity style={styles.moodCard} onPress={() => onNavigate('mood')}>
          <View style={[styles.moodCircle, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={styles.moodEmoji}>{currentMood?.emoji || '😊'}</Text>
          </View>
          <View style={styles.moodInfo}>
            <Text style={styles.moodText}>{currentMood?.label || 'Not set yet'}</Text>
            <Text style={styles.moodSubtext}>Tap to update</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={32} color={theme.colors.primary} />
          <Text style={styles.statNumber}>{eventCount || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={32} color={theme.colors.accent} />
          <Text style={styles.statNumber}>{noteCount || 0}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color={theme.colors.secondary} />
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('calendar')}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.primarySoft }]}>
            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.actionText}>Calendar</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('mood')}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.accentLight }]}>
            <Ionicons name="happy" size={24} color={theme.colors.accent} />
          </View>
          <Text style={styles.actionText}>Mood Tracker</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('notes')}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.secondaryLight + '40' }]}>
            <Ionicons name="document-text" size={24} color={theme.colors.secondary} />
          </View>
          <Text style={styles.actionText}>Notes</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

// Calendar Screen with Add Event
const CalendarScreen = ({ onBack, events, onAddEvent }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');

  const handleAddEvent = () => {
    if (eventTitle.trim()) {
      onAddEvent({
        id: Date.now(),
        title: eventTitle,
        time: eventTime || 'All day',
        date: new Date().toLocaleDateString(),
      });
      setEventTitle('');
      setEventTime('');
      setShowAddModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Calendar</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Events</Text>
          {events.length === 0 ? (
            <Text style={styles.emptyText}>No events today. Tap + to add one!</Text>
          ) : (
            events.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDot} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Event</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Event title"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor={theme.colors.textMuted}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (optional)"
              value={eventTime}
              onChangeText={setEventTime}
              placeholderTextColor={theme.colors.textMuted}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
              <Text style={styles.buttonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Mood Tracker with Save
const MoodTrackerScreen = ({ onBack, currentMood, onSaveMood }) => {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const moods = [
    { emoji: '😄', label: 'Excellent', color: theme.colors.success },
    { emoji: '🙂', label: 'Good', color: theme.colors.accent },
    { emoji: '😐', label: 'Okay', color: theme.colors.warning },
    { emoji: '😔', label: 'Poor', color: theme.colors.secondary },
    { emoji: '😢', label: 'Terrible', color: theme.colors.error },
  ];

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood(selectedMood);
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Mood Tracker</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling today?</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.moodOption,
                  selectedMood?.label === mood.label && styles.moodOptionSelected,
                  selectedMood?.label === mood.label && { backgroundColor: mood.color + '30' },
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmojiLarge}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood?.label === mood.label && styles.moodLabelSelected,
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={!selectedMood}>
            <Text style={styles.buttonText}>Save Mood</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Notes Screen with Add/Delete
const NotesScreen = ({ onBack, notes, onAddNote, onDeleteNote }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote({
        id: Date.now(),
        text: noteText,
        date: new Date().toLocaleDateString(),
      });
      setNoteText('');
      setShowAddModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Notes</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {notes.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No notes yet. Tap + to add one!</Text>
          </View>
        ) : (
          notes.map(note => (
            <View key={note.id} style={styles.card}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <TouchableOpacity onPress={() => onDeleteNote(note.id)}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Note</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your note..."
              value={noteText}
              onChangeText={setNoteText}
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={6}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddNote}>
              <Text style={styles.buttonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Menu Screen
const MenuScreen = ({ onClose, onNavigate }) => (
  <View style={styles.container}>
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Menu</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('stats'); onClose(); }}>
        <View style={[styles.menuIcon, { backgroundColor: theme.colors.primarySoft }]}>
          <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.menuText}>Statistics</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('settings'); onClose(); }}>
        <View style={[styles.menuIcon, { backgroundColor: theme.colors.accentLight }]}>
          <Ionicons name="settings" size={24} color={theme.colors.accent} />
        </View>
        <Text style={styles.menuText}>Settings</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onNavigate('profile'); onClose(); }}>
        <View style={[styles.menuIcon, { backgroundColor: theme.colors.secondaryLight + '40' }]}>
          <Ionicons name="person" size={24} color={theme.colors.secondary} />
        </View>
        <Text style={styles.menuText}>Profile</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// Stats Screen
const StatsScreen = ({ onBack, moods, events, notes }) => (
  <View style={styles.container}>
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Statistics</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Activity</Text>
        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{moods.length}</Text>
            <Text style={styles.statLabel}>Mood Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
);

// Settings Screen
const SettingsScreen = ({ onBack }) => (
  <View style={styles.container}>
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Settings</Text>
        <Text style={styles.description}>Customize colors, fonts, and preferences</Text>
      </View>
    </ScrollView>
  </View>
);

// Profile Screen
const ProfileScreen = ({ onBack }) => (
  <View style={styles.container}>
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.headerGradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={60} color={theme.colors.primary} />
        </View>
        <Text style={styles.profileName}>User</Text>
        <Text style={styles.description}>Edit your profile information</Text>
      </View>
    </ScrollView>
  </View>
);

// Main App
export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [showMenu, setShowMenu] = useState(false);
  const [moods, setMoods] = useState([]);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);

  const navigate = (newScreen) => {
    setScreen(newScreen);
    setShowMenu(false);
  };

  const currentMood = moods.length > 0 ? moods[moods.length - 1] : null;

  const handleSaveMood = (mood) => {
    setMoods([...moods, { ...mood, id: Date.now(), date: new Date().toLocaleDateString() }]);
  };

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
  };

  const handleAddNote = (note) => {
    setNotes([...notes, note]);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
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
      {screen === 'dashboard' && (
        <DashboardScreen 
          onNavigate={navigate}
          currentMood={currentMood}
          eventCount={events.length}
          noteCount={notes.length}
        />
      )}
      {screen === 'calendar' && (
        <CalendarScreen 
          onBack={() => navigate('dashboard')}
          events={events}
          onAddEvent={handleAddEvent}
        />
      )}
      {screen === 'mood' && (
        <MoodTrackerScreen 
          onBack={() => navigate('dashboard')}
          currentMood={currentMood}
          onSaveMood={handleSaveMood}
        />
      )}
      {screen === 'notes' && (
        <NotesScreen 
          onBack={() => navigate('dashboard')}
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
      {screen === 'stats' && (
        <StatsScreen 
          onBack={() => navigate('dashboard')}
          moods={moods}
          events={events}
          notes={notes}
        />
      )}
      {screen === 'settings' && <SettingsScreen onBack={() => navigate('dashboard')} />}
      {screen === 'profile' && <ProfileScreen onBack={() => navigate('dashboard')} />}
    </>
  );
}

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
  headerGradient: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  iconCircleSmall: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
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
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    minWidth: 200,
    alignItems: 'center',
    ...theme.shadows.md,
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
    lineHeight: 20,
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  moodCircle: {
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
  },
  moodSubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  moodOption: {
    width: '30%',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  moodOptionSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  moodEmojiLarge: {
    fontSize: 36,
    marginBottom: theme.spacing.xs,
  },
  moodLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  moodLabelSelected: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  eventTime: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  noteDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  noteText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
