import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const Notes = ({ note, date, onSaveNote }) => {
  const [noteText, setNoteText] = useState(note || '')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setNoteText(note || '')
  }, [note, date])

  const handleSave = () => {
    const dateKey = format(date, 'yyyy-MM-dd')
    onSaveNote(dateKey, noteText)
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setNoteText(e.target.value)
    // Auto-save after 2 seconds of no typing
    clearTimeout(window.noteSaveTimeout)
    window.noteSaveTimeout = setTimeout(() => {
      handleSave()
    }, 2000)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Daily Notes</h3>
        {isEditing && (
          <button
            onClick={handleSave}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Save
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {format(date, 'EEEE, MMMM d, yyyy')}
      </p>
      <textarea
        value={noteText}
        onChange={handleChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          handleSave()
          setIsEditing(false)
        }}
        placeholder="Write your notes for today..."
        className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <p className="text-xs text-gray-400 mt-2">
        Notes save automatically
      </p>
    </div>
  )
}

export default Notes
