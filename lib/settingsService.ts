import {
	doc,
	getDoc,
	setDoc,
	serverTimestamp,
	onSnapshot,
	Firestore,
} from 'firebase/firestore'
import { db } from './firebase'

export type UserSettings = {
	sortBy?: 'name' | 'createdAt'
	sortOrder?: 'asc' | 'desc'
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
