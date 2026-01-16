# Friends Database - Mobile-First Next.js App

A mobile-first Next.js application for managing your friends database with Firebase authentication and Firestore database.

## Features

-   🔐 **Firebase Authentication** - Secure user authentication with email/password
-   📱 **Mobile-First Design** - Responsive design optimized for mobile devices
-   👥 **Friends Management** - Add, edit, delete, and view your friends
-   🔒 **Private Accounts** - Each user has their own private friend list
-   🎨 **Dark Mode Support** - Automatic dark mode based on system preferences
-   ⚡ **Real-time Updates** - Fast and efficient data synchronization with Firestore

## Tech Stack

-   **Framework**: Next.js 16 with App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: Firebase Firestore
-   **Authentication**: Firebase Auth

## Getting Started

### Prerequisites

-   Node.js 18+ installed
-   A Firebase project ([Create one here](https://console.firebase.google.com/))

### Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
    - Go to Authentication > Sign-in method
    - Enable "Email/Password" provider
3. Create a Firestore Database:
    - Go to Firestore Database
    - Click "Create database"
    - Start in production mode or test mode (you'll add security rules next)
4. Set up Firestore Security Rules:
    - Go to Firestore Database > Rules
    - Replace the default rules with the rules provided in the "Security Rules" section below
    - Publish the rules
5. Get your Firebase configuration:
    - Go to Project Settings > General
    - Scroll down to "Your apps"
    - Click the web icon (</>)
    - Copy the configuration values

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MareliBasson/oremi-mvp.git
cd oremi-mvp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in to your account
3. **Add Friends**: Click "Add Friend" to add a new friend with their details
4. **Edit Friends**: Click "Edit" on any friend card to update their information
5. **Delete Friends**: Click "Delete" to remove a friend from your list
6. **Sign Out**: Click "Logout" to sign out of your account

## Project Structure

```
oremi-mvp/
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── friends/            # Friends list page
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Home page (redirects to login/friends)
│   └── globals.css         # Global styles
├── components/             # Reusable React components
├── contexts/
│   └── AuthContext.tsx     # Authentication context and hooks
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   └── friendsService.ts   # Firestore service for friends CRUD
├── types/
│   └── friend.ts           # TypeScript interfaces for Friend data
└── .env.example            # Example environment variables
```

## Firestore Data Structure

### Friends Collection

```typescript
{
  id: string;              // Auto-generated document ID
  name: string;            // Friend's name (required)
  email?: string;          // Friend's email (optional)
  phone?: string;          // Friend's phone (optional)
  birthday?: string;       // Friend's birthday (optional)
  notes?: string;          // Additional notes (optional)
  userId: string;          // Owner's user ID (for privacy)
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

## Security Rules

**IMPORTANT**: These security rules are essential for protecting user data. Make sure to apply them in your Firebase Console before deploying your app.

Add these Firestore security rules to ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /friends/{friendId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy to Netlify:

1. Push your code to GitHub
2. Import your repository on Netlify
3. Add your environment variables in Netlify project settings
4. Deploy!

## Learn More

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Firebase Documentation](https://firebase.google.com/docs)
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is open source and available under the MIT License.
