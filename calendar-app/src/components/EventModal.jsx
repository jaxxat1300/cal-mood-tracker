import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const EventModal = ({ event, timeSlot, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [category, setCategory] = useState('personal')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (event) {
      setTitle(event.title || '')
      setTime(event.time || '')
      setDuration(event.duration || 30)
      setCategory(event.category || 'personal')
      setDate(event.date || event.startDate || format(new Date(), 'yyyy-MM-dd'))
    } else if (timeSlot) {
      setTime(timeSlot.time || '')
      setDate(format(timeSlot.date, 'yyyy-MM-dd'))
    } else {
      setDate(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [event, timeSlot])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title,
      time,
      duration: parseInt(duration),
      category,
      date,
      startDate: date,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="work"
                    checked={category === 'work'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mr-2"
                  />
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-blue-600 rounded mr-2"></span>
                    Work
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="personal"
                    checked={category === 'personal'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mr-2"
                  />
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded mr-2"></span>
                    Personal
                  </span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                {event ? 'Update Event' : 'Create Event'}
              </button>
              {event && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(event.id)
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventModal
