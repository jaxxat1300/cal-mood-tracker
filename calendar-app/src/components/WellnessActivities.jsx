import { useState } from 'react'
import { format } from 'date-fns'

const defaultActivities = [
  { name: 'Meditation', duration: 15, icon: '🧘' },
  { name: 'Exercise', duration: 30, icon: '🏃' },
  { name: 'Reading', duration: 20, icon: '📚' },
  { name: 'Journaling', duration: 10, icon: '✍️' },
  { name: 'Yoga', duration: 30, icon: '🧘‍♀️' },
  { name: 'Walking', duration: 20, icon: '🚶' },
  { name: 'Breathing Exercise', duration: 5, icon: '💨' },
  { name: 'Stretching', duration: 15, icon: '🤸' },
]

const WellnessActivities = ({ activities, onAddActivity, currentDate }) => {
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customDuration, setCustomDuration] = useState(15)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('personal')

  const handleQuickAdd = (activity, time) => {
    onAddActivity(activity, time, selectedCategory)
    setSelectedTime('')
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (customName.trim()) {
      const customActivity = {
        name: customName,
        duration: customDuration,
        icon: '⭐',
      }
      onAddActivity(customActivity, selectedTime || '09:00', selectedCategory)
      setCustomName('')
      setCustomDuration(15)
      setSelectedTime('')
      setShowCustom(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wellness Activities</h3>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showCustom ? 'Cancel' : '+ Custom'}
        </button>
      </div>

      {showCustom && (
        <form onSubmit={handleAddCustom} className="mb-4 p-3 bg-purple-50 rounded-lg">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Activity name"
            className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={customDuration}
              onChange={(e) => setCustomDuration(parseInt(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
          <div className="flex space-x-2 mb-2">
            <label className="flex items-center text-sm">
              <input
                type="radio"
                value="work"
                checked={selectedCategory === 'work'}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-1"
              />
              Work
            </label>
            <label className="flex items-center text-sm">
              <input
                type="radio"
                value="personal"
                checked={selectedCategory === 'personal'}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-1"
              />
              Personal
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Custom Activity
          </button>
        </form>
      )}

      <div className="mb-3">
        <label className="block text-xs text-gray-600 mb-1">Quick add time:</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-600 mb-1">Add to calendar:</label>
        <div className="flex space-x-2">
          <label className="flex items-center text-sm">
            <input
              type="radio"
              value="work"
              checked={selectedCategory === 'work'}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mr-1"
            />
            Work
          </label>
          <label className="flex items-center text-sm">
            <input
              type="radio"
              value="personal"
              checked={selectedCategory === 'personal'}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mr-1"
            />
            Personal
          </label>
        </div>
      </div>

      <div className="space-y-2">
        {defaultActivities.map((activity, index) => (
          <button
            key={index}
            onClick={() => handleQuickAdd(activity, selectedTime || '09:00')}
            className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{activity.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{activity.name}</div>
                <div className="text-xs text-gray-500">{activity.duration} minutes</div>
              </div>
            </div>
            <span className="text-purple-600">+</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WellnessActivities
