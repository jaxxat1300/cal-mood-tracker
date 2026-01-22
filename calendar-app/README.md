# Calendar App - Work & Life Balance

A fully functional calendar application with event management, habit tracking, wellness activities, and daily notes.

## Features

- **Multiple Calendar Views**: Day, Month, and Year views
- **Event Management**: Create, edit, and delete events with time slots (7 AM - 9 PM)
- **Dual Calendars**: Separate work (blue) and personal (green) calendars
- **Habit Tracking**: Morning (AM) and Evening (PM) habit sections
- **Wellness Activities**: Pre-defined activities library with custom activity creation
- **Daily Notes**: Persistent notes that save automatically
- **Responsive Design**: Works on all screen sizes
- **Local Storage**: All data persists in browser localStorage

## Installation

```bash
cd calendar-app
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- date-fns

## Usage

1. **Create Events**: Click any time slot in Day view to create an event
2. **Switch Views**: Use Day/Month/Year buttons to change calendar views
3. **Track Habits**: Add morning and evening habits, check them off as completed
4. **Add Wellness**: Click wellness activities to quickly add them to your calendar
5. **Write Notes**: Daily notes save automatically as you type
