import {
	doc,
	getDoc,
	setDoc,
	serverTimestamp,
	onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

export type UserSettings = {
	sortBy?: 'name' | 'createdAt'
	sortOrder?: 'asc' | 'desc'
	// How often the user wants to check in with friends.
	// New shape supports an interval + number (every N units).
	checkInFrequency?:
		| { interval: 'days'; every: number }
		| { interval: 'weeks'; every: number }
		| { interval: 'months'; every: number }
	// Whether check-in reminders are enabled for the user.
	checkInEnabled?: boolean
}

export async function getSettings(uid: string): Promise<UserSettings> {
	if (!db) throw new Error('Firebase not initialized')
	const ref = doc(db, 'users', uid)
	const snap = await getDoc(ref)
	if (!snap.exists()) return {}
	const data = snap.data()
	return (data.settings as UserSettings) || {}
}

export async function saveSettings(
	uid: string,
	settings: UserSettings
): Promise<void> {
	if (!db) throw new Error('Firebase not initialized')
	const ref = doc(db, 'users', uid)
	await setDoc(
		ref,
		{ settings, updatedAt: serverTimestamp() },
		{ merge: true }
	)
}

export function subscribeToSettings(
	uid: string,
	cb: (s: UserSettings) => void
) {
	if (!db) throw new Error('Firebase not initialized')
	const ref = doc(db, 'users', uid)
	const unsub = onSnapshot(ref, (snap) => {
		if (!snap.exists()) return cb({})
		const data = snap.data()
		cb((data.settings as UserSettings) || {})
	})
	return unsub
}

// Ensure a user document exists for a newly created user.
export async function createUserIfNotExists(
	uid: string,
	email?: string,
	displayName?: string | null,
	photoURL?: string | null
): Promise<void> {
	if (!db) throw new Error('Firebase not initialized')
	const ref = doc(db, 'users', uid)
	const snap = await getDoc(ref)
	if (!snap.exists()) {
		// derive first/last name from displayName when available
		let firstName: string | undefined = undefined
		let lastName: string | undefined = undefined
		if (displayName) {
			const parts = displayName.trim().split(/\s+/)
			if (parts.length === 1) {
				firstName = parts[0]
			} else if (parts.length > 1) {
				firstName = parts[0]
				lastName = parts.slice(1).join(' ')
			}
		}

		await setDoc(
			ref,
			{
				createdAt: serverTimestamp(),
				email,
				displayName: displayName || null,
				firstName: firstName || null,
				lastName: lastName || null,
				photoURL: photoURL || null,
				settings: {},
			},
			{ merge: true }
		)
	}
}
