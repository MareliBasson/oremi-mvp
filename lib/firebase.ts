import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
	messagingSenderId:
		process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Check if we have valid configuration
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId

// Initialize Firebase only on the client side
// Firebase Client SDK is designed for client-side use only
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let googleProvider: GoogleAuthProvider | undefined

if (typeof window !== 'undefined') {
	if (!hasValidConfig) {
		console.warn(
			'Firebase configuration is missing. Please set up environment variables.'
		)
	} else {
		app =
			getApps().length === 0
				? initializeApp(firebaseConfig)
				: getApps()[0]
		auth = getAuth(app)
		googleProvider = new GoogleAuthProvider()
		db = getFirestore(app)
	}
}

export { app, auth, db, googleProvider }

// Helper to get a client Auth instance reliably (call only on client)
export function getClientAuth(): Auth {
	if (typeof window === 'undefined') {
		throw new Error('getClientAuth must be called on the client')
	}

	if (!hasValidConfig) {
		throw new Error('Firebase configuration missing')
	}

	if (!app) {
		app =
			getApps().length === 0
				? initializeApp(firebaseConfig)
				: getApps()[0]
	}

	if (!auth) {
		auth = getAuth(app)
	}

	return auth
}
