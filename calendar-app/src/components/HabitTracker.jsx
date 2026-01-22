import { useState } from 'react'
import { format } from 'date-fns'

const HabitTracker = ({ habits, currentDate, onAddHabit, onToggleHabit, onRemoveHabit }) => {
  const [newHabitAM, setNewHabitAM] = useState('')
  const [newHabitPM, setNewHabitPM] = useState('')

  const todayKey = format(currentDate, 'yyyy-MM-dd')
  const todayHabitsAM = habits.am.filter(h => h.date === todayKey)
  const todayHabitsPM = habits.pm.filter(h => h.date === todayKey)

  const handleAddHabitAM = (e) => {
    e.preventDefault()
    if (newHabitAM.trim()) {
      onAddHabit('am', newHabitAM)
      setNewHabitAM('')
    }
  }

  const handleAddHabitPM = (e) => {
    e.preventDefault()
    if (newHabitPM.trim()) {
      onAddHabit('pm', newHabitPM)
      setNewHabitPM('')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Tracker</h3>
      
      {/* AM Habits */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Morning Habits</h4>
          <span className="text-xs text-gray-500">AM</span>
        </div>
        <form onSubmit={handleAddHabitAM} className="mb-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHabitAM}
              onChange={(e) => setNewHabitAM(e.target.value)}
              placeholder="Add morning habit..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
        <div className="space-y-2">
          {todayHabitsAM.map(habit => (
            <div
              key={habit.id}
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => onToggleHabit('am', habit.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span
                className={`flex-1 text-sm ${
                  habit.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {habit.name}
              </span>
              <button
                onClick={() => onRemoveHabit('am', habit.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          {todayHabitsAM.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">No morning habits yet</p>
          )}
        </div>
      </div>

      {/* PM Habits */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Evening Habits</h4>
          <span className="text-xs text-gray-500">PM</span>
        </div>
        <form onSubmit={handleAddHabitPM} className="mb-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHabitPM}
              onChange={(e) => setNewHabitPM(e.target.value)}
              placeholder="Add evening habit..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
        <div className="space-y-2">
          {todayHabitsPM.map(habit => (
            <div
              key={habit.id}
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => onToggleHabit('pm', habit.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span
                className={`flex-1 text-sm ${
                  habit.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {habit.name}
              </span>
              <button
                onClick={() => onRemoveHabit('pm', habit.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          {todayHabitsPM.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">No evening habits yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HabitTracker
