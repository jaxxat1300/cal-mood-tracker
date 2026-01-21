import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { format, parseISO, isSameDay } from 'date-fns';
import Card from '../components/Card';
import Button from '../components/Button';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const { events, wellnessActivities, addEvent, deleteEvent, addWellnessActivity, deleteWellnessActivity, settings } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', date: selectedDate, time: '', description: '' });
  const [wellnessForm, setWellnessForm] = useState({ title: '', date: selectedDate, time: '', description: '' });
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);

  const markedDates = {};
  
  [...events, ...wellnessActivities].forEach(item => {
    const dateStr = format(parseISO(item.date), 'yyyy-MM-dd');
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { marked: true, dotColor: theme.colors.primary };
    }
  });

  const handleAddEvent = () => {
    if (!eventForm.title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    addEvent({
      ...eventForm,
      date: new Date(eventForm.date).toISOString(),
      type: 'event',
    });
    setEventForm({ title: '', date: selectedDate, time: '', description: '' });
    setShowEventModal(false);
  };

  const handleAddWellness = () => {
    if (!wellnessForm.title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    addWellnessActivity({
      ...wellnessForm,
      date: new Date(wellnessForm.date).toISOString(),
      type: 'wellness',
    });
    setWellnessForm({ title: '', date: selectedDate, time: '', description: '' });
    setShowWellnessModal(false);
  };

  const getDayEvents = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      events: events.filter(e => format(parseISO(e.date), 'yyyy-MM-dd') === dateStr),
      wellness: wellnessActivities.filter(w => format(parseISO(w.date), 'yyyy-MM-dd') === dateStr),
    };
  };

  const selectedDayData = getDayEvents(parseISO(selectedDate));

  const timeBlocks = [];
  for (let hour = 7; hour < 22; hour++) {
    timeBlocks.push(`${hour.toString().padStart(2, '0')}:00`);
    timeBlocks.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const getEventsForTimeBlock = (timeBlock) => {
    return [...selectedDayData.events, ...selectedDayData.wellness].filter(item => {
      if (!item.time) return false;
      return item.time.startsWith(timeBlock);
    });
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
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          onPress={() => setShowEventModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        {['month', 'week', 'day'].map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.viewModeButton, viewMode === mode && styles.viewModeButtonActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.viewModeText, viewMode === mode && styles.viewModeTextActive]}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {viewMode === 'month' && (
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setViewMode('day');
            }}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                selectedColor: settings.calendarColor || theme.colors.primary,
              },
            }}
            theme={{
              backgroundColor: theme.colors.white,
              calendarBackground: theme.colors.white,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: settings.calendarColor || theme.colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.textMuted,
              dotColor: theme.colors.primary,
              selectedDotColor: '#FFFFFF',
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
            }}
            style={styles.calendar}
          />
        )}

        {viewMode === 'day' && (
          <View>
            <Card style={styles.dayHeader}>
              <Text style={styles.dayDate}>{format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowEventModal(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.actionButtonText}>Event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowWellnessModal(true)}
                >
                  <Ionicons name="fitness-outline" size={20} color={theme.colors.secondary} />
                  <Text style={styles.actionButtonText}>Wellness</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Time Blocks */}
            <View style={styles.timeBlocksContainer}>
              <View style={styles.timeSection}>
                <Text style={styles.sectionTitle}>Morning (7:00 AM - 12:00 PM)</Text>
                {timeBlocks.slice(0, 10).map(timeBlock => (
                  <TouchableOpacity
                    key={timeBlock}
                    style={styles.timeBlock}
                    onPress={() => setSelectedTimeBlock(timeBlock)}
                  >
                    <Text style={styles.timeBlockTime}>{timeBlock}</Text>
                    <View style={styles.timeBlockContent}>
                      {getEventsForTimeBlock(timeBlock).map(item => (
                        <View
                          key={item.id}
                          style={[
                            styles.timeBlockEvent,
                            { backgroundColor: item.type === 'wellness' ? theme.colors.secondaryLight : theme.colors.primaryLight + '80' }
                          ]}
                        >
                          <Text style={styles.timeBlockEventText}>{item.title}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.timeSection}>
                <Text style={styles.sectionTitle}>Work Time (12:00 PM - 5:00 PM)</Text>
                {timeBlocks.slice(10, 20).map(timeBlock => (
                  <TouchableOpacity
                    key={timeBlock}
                    style={styles.timeBlock}
                    onPress={() => setSelectedTimeBlock(timeBlock)}
                  >
                    <Text style={styles.timeBlockTime}>{timeBlock}</Text>
                    <View style={styles.timeBlockContent}>
                      {getEventsForTimeBlock(timeBlock).map(item => (
                        <View
                          key={item.id}
                          style={[
                            styles.timeBlockEvent,
                            { backgroundColor: item.type === 'wellness' ? theme.colors.secondaryLight : theme.colors.primaryLight + '80' }
                          ]}
                        >
                          <Text style={styles.timeBlockEventText}>{item.title}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.timeSection}>
                <Text style={styles.sectionTitle}>Evening (5:00 PM - 10:00 PM)</Text>
                {timeBlocks.slice(20).map(timeBlock => (
                  <TouchableOpacity
                    key={timeBlock}
                    style={styles.timeBlock}
                    onPress={() => setSelectedTimeBlock(timeBlock)}
                  >
                    <Text style={styles.timeBlockTime}>{timeBlock}</Text>
                    <View style={styles.timeBlockContent}>
                      {getEventsForTimeBlock(timeBlock).map(item => (
                        <View
                          key={item.id}
                          style={[
                            styles.timeBlockEvent,
                            { backgroundColor: item.type === 'wellness' ? theme.colors.secondaryLight : theme.colors.primaryLight + '80' }
                          ]}
                        >
                          <Text style={styles.timeBlockEventText}>{item.title}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Day Events List */}
        {(selectedDayData.events.length > 0 || selectedDayData.wellness.length > 0) && (
          <Card style={styles.eventsCard}>
            <Text style={styles.cardTitle}>Events & Activities</Text>
            {selectedDayData.events.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventContent}>
                  <View style={[styles.eventDot, { backgroundColor: theme.colors.primary }]} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.time && <Text style={styles.eventTime}>{event.time}</Text>}
                    {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedDayData.wellness.map(activity => (
              <View key={activity.id} style={styles.eventItem}>
                <View style={styles.eventContent}>
                  <View style={[styles.eventDot, { backgroundColor: theme.colors.secondary }]} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{activity.title}</Text>
                    {activity.time && <Text style={styles.eventTime}>{activity.time}</Text>}
                    {activity.description && <Text style={styles.eventDescription}>{activity.description}</Text>}
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteWellnessActivity(activity.id)}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Event</Text>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={eventForm.title}
              onChangeText={(text) => setEventForm({ ...eventForm, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={eventForm.date}
              onChangeText={(text) => setEventForm({ ...eventForm, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (HH:MM)"
              value={eventForm.time}
              onChangeText={(text) => setEventForm({ ...eventForm, time: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={eventForm.description}
              onChangeText={(text) => setEventForm({ ...eventForm, description: text })}
              multiline
              numberOfLines={4}
            />
            <Button title="Add Event" onPress={handleAddEvent} />
          </Card>
        </View>
      </Modal>

      {/* Add Wellness Modal */}
      <Modal
        visible={showWellnessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWellnessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Wellness Activity</Text>
              <TouchableOpacity onPress={() => setShowWellnessModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Activity Title"
              value={wellnessForm.title}
              onChangeText={(text) => setWellnessForm({ ...wellnessForm, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={wellnessForm.date}
              onChangeText={(text) => setWellnessForm({ ...wellnessForm, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (HH:MM)"
              value={wellnessForm.time}
              onChangeText={(text) => setWellnessForm({ ...wellnessForm, time: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={wellnessForm.description}
              onChangeText={(text) => setWellnessForm({ ...wellnessForm, description: text })}
              multiline
              numberOfLines={4}
            />
            <Button title="Add Activity" onPress={handleAddWellness} />
          </Card>
        </View>
      </Modal>
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
  addButton: {
    padding: theme.spacing.xs,
  },
  viewModeContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: 4,
  },
  viewModeButtonActive: {
    backgroundColor: theme.colors.primaryLight + '30',
  },
  viewModeText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  viewModeTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  calendar: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  dayHeader: {
    marginBottom: theme.spacing.md,
  },
  dayDate: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundLight,
  },
  actionButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.text,
    fontWeight: '500',
  },
  timeBlocksContainer: {
    marginBottom: theme.spacing.md,
  },
  timeSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  timeBlock: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timeBlockTime: {
    width: 80,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  timeBlockContent: {
    flex: 1,
  },
  timeBlockEvent: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  timeBlockEventText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  eventsCard: {
    marginTop: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  eventContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.md,
    marginTop: 6,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  eventDescription: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default CalendarScreen;
