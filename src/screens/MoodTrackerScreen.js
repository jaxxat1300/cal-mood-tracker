import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { format } from 'date-fns';

const MoodTrackerScreen = () => {
  const navigation = useNavigation();
  const { moodEntries, addMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { id: 'excellent', emoji: '😄', label: 'Excellent', color: theme.colors.success },
    { id: 'good', emoji: '🙂', label: 'Good', color: theme.colors.accent },
    { id: 'okay', emoji: '😐', label: 'Okay', color: theme.colors.warning },
    { id: 'poor', emoji: '😔', label: 'Poor', color: theme.colors.secondary },
    { id: 'terrible', emoji: '😢', label: 'Terrible', color: theme.colors.error },
  ];

  const todayEntry = moodEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === new Date().toDateString();
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }

    addMoodEntry({
      mood: selectedMood,
      note: note.trim(),
    });

    Alert.alert('Success', 'Mood saved successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setSelectedMood(null);
          setNote('');
        },
      },
    ]);
  };

  const recentEntries = moodEntries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Tracker</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Stats')}
          style={styles.statsButton}
        >
          <Ionicons name="stats-chart-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Today's Mood */}
        <Card style={styles.todayCard}>
          <Text style={styles.cardTitle}>How are you feeling today?</Text>
          <Text style={styles.cardSubtitle}>{format(new Date(), 'EEEE, MMMM d')}</Text>

          {todayEntry ? (
            <View style={styles.todayEntry}>
              <View style={[styles.moodEmojiContainer, { backgroundColor: moods.find(m => m.id === todayEntry.mood)?.color + '30' }]}>
                <Text style={styles.moodEmoji}>{moods.find(m => m.id === todayEntry.mood)?.emoji}</Text>
              </View>
              <Text style={styles.todayMoodLabel}>{moods.find(m => m.id === todayEntry.mood)?.label}</Text>
              {todayEntry.note && (
                <Text style={styles.todayNote}>{todayEntry.note}</Text>
              )}
              <Text style={styles.todayTime}>{format(new Date(todayEntry.date), 'h:mm a')}</Text>
            </View>
          ) : (
            <View>
              <View style={styles.moodSelector}>
                {moods.map(mood => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodOption,
                      selectedMood === mood.id && styles.moodOptionSelected,
                      selectedMood === mood.id && { backgroundColor: mood.color + '30' },
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                  >
                    <Text style={styles.moodEmojiLarge}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      selectedMood === mood.id && styles.moodLabelSelected,
                    ]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder="Add a note (optional)"
                placeholderTextColor={theme.colors.textMuted}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
              />

              <Button
                title="Save Mood"
                onPress={handleSaveMood}
                disabled={!selectedMood}
                style={styles.saveButton}
              />
            </View>
          )}
        </Card>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <Card style={styles.recentCard}>
            <Text style={styles.cardTitle}>Recent Entries</Text>
            {recentEntries.map(entry => {
              const mood = moods.find(m => m.id === entry.mood);
              return (
                <View key={entry.id} style={styles.recentEntry}>
                  <View style={styles.recentEntryLeft}>
                    <View style={[styles.recentMoodCircle, { backgroundColor: mood?.color + '30' }]}>
                      <Text style={styles.recentEmoji}>{mood?.emoji}</Text>
                    </View>
                    <View style={styles.recentEntryInfo}>
                      <Text style={styles.recentMoodLabel}>{mood?.label}</Text>
                      <Text style={styles.recentDate}>{format(new Date(entry.date), 'MMM d, yyyy • h:mm a')}</Text>
                      {entry.note && (
                        <Text style={styles.recentNote} numberOfLines={2}>{entry.note}</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        {/* Mood Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.cardTitle}>This Week's Mood</Text>
          <View style={styles.insightsContent}>
            {moods.map(mood => {
              const count = moodEntries.filter(e => {
                const entryDate = new Date(e.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return e.mood === mood.id && entryDate >= weekAgo;
              }).length;
              
              return (
                <View key={mood.id} style={styles.insightItem}>
                  <Text style={styles.insightEmoji}>{mood.emoji}</Text>
                  <View style={styles.insightBarContainer}>
                    <View
                      style={[
                        styles.insightBar,
                        { width: `${Math.max(5, (count / 7) * 100)}%`, backgroundColor: mood.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.insightCount}>{count}</Text>
                </View>
              );
            })}
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
  menuButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statsButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  todayCard: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  todayEntry: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  moodEmojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodEmojiLarge: {
    fontSize: 36,
  },
  todayMoodLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  todayNote: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  todayTime: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  moodOption: {
    width: '18%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  moodOptionSelected: {
    borderWidth: 2,
  },
  moodLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  moodLabelSelected: {
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.sm,
  },
  recentCard: {
    marginBottom: theme.spacing.md,
  },
  recentEntry: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentEntryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recentMoodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  recentEmoji: {
    fontSize: 20,
  },
  recentEntryInfo: {
    flex: 1,
  },
  recentMoodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  recentNote: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  insightsCard: {
    marginBottom: theme.spacing.md,
  },
  insightsContent: {
    marginTop: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  insightEmoji: {
    fontSize: 24,
    width: 40,
  },
  insightBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  insightBar: {
    height: '100%',
    borderRadius: 4,
  },
  insightCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    width: 30,
    textAlign: 'right',
  },
});

export default MoodTrackerScreen;
