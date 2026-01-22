import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfYear, endOfYear, eachMonthOfInterval, getDay, addDays, isToday } from 'date-fns'

const Calendar = ({ view, currentDate, events, onTimeSlotClick, onEventClick }) => {
  if (view === 'day') {
    return <DayView date={currentDate} events={events} onTimeSlotClick={onTimeSlotClick} onEventClick={onEventClick} />
  } else if (view === 'month') {
    return <MonthView date={currentDate} events={events} onEventClick={onEventClick} />
  } else {
    return <YearView date={currentDate} />
  }
}

// Day View with Time Slots (7 AM - 9 PM)
const DayView = ({ date, events, onTimeSlotClick, onEventClick }) => {
  const hours = []
  for (let i = 7; i <= 21; i++) {
    hours.push(i)
  }

  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date || event.startDate)
    return isSameDay(eventDate, date)
  })

  const getEventsForHour = (hour) => {
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.time?.split(':')[0] || 0)
      return eventHour === hour || (eventHour < hour && eventHour + (event.duration || 30) / 60 > hour)
    })
  }

  return (
    <div className="card">
      <div className="overflow-y-auto max-h-[600px]">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour)
          return (
            <div key={hour} className="border-b border-gray-200 min-h-[80px] relative">
              <div className="flex">
                <div className="w-20 py-2 text-sm text-gray-600 font-medium pr-4 text-right">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                <div className="flex-1 relative">
                  <button
                    onClick={() => onTimeSlotClick(`${hour}:00`, date)}
                    className="absolute inset-0 w-full h-full hover:bg-blue-50 transition-colors cursor-pointer"
                  />
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className={`absolute left-0 right-0 mx-1 px-2 py-1 rounded text-white text-sm cursor-pointer z-10 ${
                        event.category === 'work' ? 'bg-blue-600' : 
                        event.category === 'personal' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}
                      style={{
                        top: '4px',
                        height: `${((event.duration || 30) / 60) * 80 - 8}px`,
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90">{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Month View
const MonthView = ({ date, events, onEventClick }) => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const startDay = getDay(monthStart)
  const emptyDays = Array(startDay).fill(null)

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date || event.startDate)
      return isSameDay(eventDate, day)
    })
  }

  return (
    <div className="card">
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        {daysInMonth.map(day => {
          const dayEvents = getEventsForDay(day)
          const isCurrentDay = isToday(day)
          return (
            <div
              key={day.toString()}
              className={`aspect-square border border-gray-200 p-1 hover:bg-gray-50 transition-colors ${
                isCurrentDay ? 'bg-blue-50 border-blue-400' : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${
                      event.category === 'work' ? 'bg-blue-600 text-white' : 
                      event.category === 'personal' ? 'bg-green-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Year View
const YearView = ({ date }) => {
  const yearStart = startOfYear(date)
  const yearEnd = endOfYear(date)
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  return (
    <div className="card">
      <div className="grid grid-cols-3 gap-4">
        {months.map(month => {
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
          const startDay = getDay(monthStart)
          const emptyDays = Array(startDay).fill(null)

          return (
            <div key={month.toString()} className="border border-gray-200 rounded p-2">
              <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
                {format(month, 'MMMM')}
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`}></div>
                ))}
                {daysInMonth.map(day => (
                  <div
                    key={day.toString()}
                    className={`aspect-square flex items-center justify-center text-xs ${
                      isToday(day) ? 'bg-blue-600 text-white rounded' : 'text-gray-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
