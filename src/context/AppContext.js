import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [wellnessActivities, setWellnessActivities] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [notes, setNotes] = useState([]);
  const [settings, setSettings] = useState({
    calendarColor: '#9B7EDE',
    fontFamily: 'System',
    theme: 'light',
    notifications: true,
  });
  const [stats, setStats] = useState({
    totalSignIns: 0,
    totalMoodEntries: 0,
    totalEvents: 0,
    totalWellnessActivities: 0,
    streakDays: 0,
    lastSignIn: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [events, wellnessActivities, moodEntries, notes, settings, stats]);

  const loadData = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const storedWellness = await AsyncStorage.getItem('wellnessActivities');
      const storedMoods = await AsyncStorage.getItem('moodEntries');
      const storedNotes = await AsyncStorage.getItem('notes');
      const storedSettings = await AsyncStorage.getItem('settings');
      const storedStats = await AsyncStorage.getItem('stats');

      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedWellness) setWellnessActivities(JSON.parse(storedWellness));
      if (storedMoods) setMoodEntries(JSON.parse(storedMoods));
      if (storedNotes) setNotes(JSON.parse(storedNotes));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedStats) setStats(JSON.parse(storedStats));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(events));
      await AsyncStorage.setItem('wellnessActivities', JSON.stringify(wellnessActivities));
      await AsyncStorage.setItem('moodEntries', JSON.stringify(moodEntries));
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
      await AsyncStorage.setItem('stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addEvent = (event) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents([...events, newEvent]);
    setStats(prev => ({ ...prev, totalEvents: prev.totalEvents + 1 }));
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
    setStats(prev => ({ ...prev, totalEvents: Math.max(0, prev.totalEvents - 1) }));
  };

  const addWellnessActivity = (activity) => {
    const newActivity = { ...activity, id: Date.now().toString() };
    setWellnessActivities([...wellnessActivities, newActivity]);
    setStats(prev => ({ ...prev, totalWellnessActivities: prev.totalWellnessActivities + 1 }));
  };

  const deleteWellnessActivity = (activityId) => {
    setWellnessActivities(wellnessActivities.filter(a => a.id !== activityId));
    setStats(prev => ({ ...prev, totalWellnessActivities: Math.max(0, prev.totalWellnessActivities - 1) }));
  };

  const addMoodEntry = (mood) => {
    const newMood = { ...mood, id: Date.now().toString(), date: new Date().toISOString() };
    setMoodEntries([...moodEntries, newMood]);
    setStats(prev => ({ 
      ...prev, 
      totalMoodEntries: prev.totalMoodEntries + 1,
      streakDays: calculateStreak([...moodEntries, newMood])
    }));
  };

  const calculateStreak = (entries) => {
    if (entries.length === 0) return 0;
    const sorted = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sorted.length; i++) {
      const entryDate = new Date(sorted[i].date);
      entryDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };

  const updateStats = (newStats) => {
    setStats({ ...stats, ...newStats });
  };

  const recordSignIn = () => {
    setStats(prev => ({
      ...prev,
      totalSignIns: prev.totalSignIns + 1,
      lastSignIn: new Date().toISOString(),
    }));
  };

  const value = {
    user,
    setUser,
    events,
    addEvent,
    deleteEvent,
    wellnessActivities,
    addWellnessActivity,
    deleteWellnessActivity,
    moodEntries,
    addMoodEntry,
    notes,
    addNote,
    deleteNote,
    settings,
    updateSettings,
    stats,
    updateStats,
    recordSignIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
