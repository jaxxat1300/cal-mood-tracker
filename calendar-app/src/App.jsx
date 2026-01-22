import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import HabitTracker from './components/HabitTracker'
import WellnessActivities from './components/WellnessActivities'
import Notes from './components/Notes'
import { format } from 'date-fns'

function App() {
  const [view, setView] = useState('day') // day, month, year
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [habits, setHabits] = useState({ am: [], pm: [] })
  const [wellnessActivities, setWellnessActivities] = useState([])
  const [notes, setNotes] = useState({})
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents')
    const savedHabits = localStorage.getItem('habits')
    const savedWellness = localStorage.getItem('wellnessActivities')
    const savedNotes = localStorage.getItem('notes')

    if (savedEvents) setEvents(JSON.parse(savedEvents))
    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedWellness) setWellnessActivities(JSON.parse(savedWellness))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('wellnessActivities', JSON.stringify(wellnessActivities))
  }, [wellnessActivities])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const handleTimeSlotClick = (time, date) => {
    setSelectedSlot({ time, date })
    setSelectedEvent(null)
    setShowEventModal(true)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : e))
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: Date.now(),
      }
      setEvents([...events, newEvent])
    }
    setShowEventModal(false)
    setSelectedSlot(null)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId))
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleAddHabit = (period, habitName) => {
    const newHabit = {
      id: Date.now(),
      name: habitName,
      completed: false,
      date: format(currentDate, 'yyyy-MM-dd'),
    }
    setHabits({
      ...habits,
      [period]: [...habits[period], newHabit],
    })
  }

  const handleToggleHabit = (period, habitId) => {
    setHabits({
      ...habits,
      [period]: habits[period].map(h =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      ),
    })
  }

  const handleRemoveHabit = (period, habitId) => {
    setHabits({
      ...habits,
      [period]: habits[period].filter(h => h.id !== habitId),
    })
  }

  const handleAddWellnessActivity = (activity, time, category) => {
    const newEvent = {
      id: Date.now(),
      title: activity.name,
      time,
      duration: activity.duration || 30,
      category: category || 'personal',
      type: 'wellness',
      icon: activity.icon,
    }
    setEvents([...events, newEvent])
  }

  const handleSaveNote = (date, noteText) => {
    setNotes({
      ...notes,
      [date]: noteText,
    })
  }

  const todayKey = format(currentDate, 'yyyy-MM-dd')
  const todayNotes = notes[todayKey] || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar App</h1>
              <p className="text-sm text-gray-600 mt-1">Work & Life Balance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700">Work</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Personal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - (view === 'day' ? 86400000 : view === 'month' ? 2592000000 : 31536000000)))}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
            >
              ←
            </button>
            <span className="text-lg font-semibold text-gray-900">
              {format(currentDate, view === 'day' ? 'EEEE, MMMM d, yyyy' : view === 'month' ? 'MMMM yyyy' : 'yyyy')}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + (view === 'day' ? 86400000 : view === 'month' ? 2592000000 : 31536000000)))}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
            >
              →
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Area */}
          <div className="lg:col-span-2">
            <Calendar
              view={view}
              currentDate={currentDate}
              events={events}
              onTimeSlotClick={handleTimeSlotClick}
              onEventClick={handleEventClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Habit Tracker */}
            <HabitTracker
              habits={habits}
              currentDate={currentDate}
              onAddHabit={handleAddHabit}
              onToggleHabit={handleToggleHabit}
              onRemoveHabit={handleRemoveHabit}
            />

            {/* Wellness Activities */}
            <WellnessActivities
              activities={wellnessActivities}
              onAddActivity={handleAddWellnessActivity}
              currentDate={currentDate}
            />

            {/* Notes */}
            <Notes
              note={todayNotes}
              date={currentDate}
              onSaveNote={handleSaveNote}
            />
          </div>
        </div>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          timeSlot={selectedSlot}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventModal(false)
            setSelectedSlot(null)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  )
}

export default App
