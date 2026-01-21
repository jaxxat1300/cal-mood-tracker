# Cal Mood Tracker

A mobile app that helps busy people balance work and life by incorporating wellness activities into their daily schedule and tracking their mood for better mental well-being.

## Features

- **Calendar Management**: View schedules in month, week, or day view with time blocks (7 AM - 10 PM, 30-minute intervals)
- **Mood Tracking**: Daily mood tracking with insights and patterns
- **Wellness Activities**: Schedule 5-minute wellness activities into your busy day
- **Statistics Dashboard**: Track your progress, mood trends, and app usage
- **Notes**: Keep track of tasks and general notes
- **Customization**: Customize calendar colors, fonts, and appearance
- **Smooth UI**: Clean, minimal design with pastel color palette and smooth animations

## Platform

- iOS
- Android

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your iOS/Android device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

5. Or scan the QR code with Expo Go app on your device

## Project Structure

```
├── App.js                 # Main app entry point with navigation
├── src/
│   ├── components/        # Reusable components (Button, Card)
│   ├── context/           # App context for state management
│   ├── screens/           # All app screens
│   │   ├── OnboardingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── CalendarScreen.js
│   │   ├── MoodTrackerScreen.js
│   │   ├── StatsScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── HowToUseScreen.js
│   │   ├── NotificationsScreen.js
│   │   └── NotesScreen.js
│   └── styles/            # Theme and styling
└── assets/                # Images and icons
```

## Key Features Explained

### Calendar Views
- **Month View**: See your entire month at a glance
- **Week View**: Focus on weekly planning
- **Day View**: Detailed daily schedule with time blocks organized by Morning (7 AM - 12 PM), Work Time (12 PM - 5 PM), and Evening (5 PM - 10 PM)

### Mood Tracking
- Select from 5 mood options: Excellent, Good, Okay, Poor, Terrible
- Add optional notes to your mood entries
- View mood history and weekly insights
- Track mood patterns over time

### Wellness Activities
- Add wellness activities to your calendar
- Schedule activities at convenient times
- Track consistency in statistics

### Statistics
- Overall statistics (events, wellness activities, mood entries, streak)
- Average mood calculation
- Mood distribution charts
- Weekly and monthly activity summaries
- App usage tracking

## Design

- **Color Palette**: Pastel colors (purple, pink, green, blue, orange)
- **Typography**: Modern sans-serif fonts
- **Style**: Clean and minimal
- **Accessibility**: Accessible color contrast and clear navigation

## User Flow

1. **Onboarding**: First-time users see an onboarding flow
2. **Authentication**: Sign up or login
3. **Dashboard**: Overview of today's schedule, mood, and quick stats
4. **Calendar**: Add events and wellness activities, view in different time perspectives
5. **Mood Tracker**: Log daily mood and view insights
6. **Notes**: Jot down tasks and thoughts
7. **Stats**: View detailed statistics and progress
8. **Settings**: Customize app appearance and preferences

## Data Storage

The app uses AsyncStorage for local data persistence:
- User authentication
- Events and wellness activities
- Mood entries
- Notes
- Settings and preferences
- Statistics

## Future Enhancements

- Backend integration for cloud sync
- Push notifications for events and wellness reminders
- Social features (sharing progress)
- More customization options
- Export data functionality
- Integration with health apps

## License

This project is created for demonstration purposes.

## Support

For questions or support, please refer to the "How to Use" section in the app menu or contact support@calmoodtracker.com
