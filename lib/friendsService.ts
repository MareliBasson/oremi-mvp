import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	getDoc,
	query,
	where,
	getDocs,
	orderBy,
	Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Friend, FriendInput } from '@/types/friend'

const FRIENDS_COLLECTION = 'friends'

export const friendsService = {
	async getFriends(userId: string): Promise<Friend[]> {
		if (!db) throw new Error('Firebase not initialized')

		const q = query(
			collection(db, FRIENDS_COLLECTION),
			where('userId', '==', userId),
			orderBy('name', 'asc')
		)

		const querySnapshot = await getDocs(q)
		const friends: Friend[] = []

		querySnapshot.forEach((doc) => {
			const data = doc.data()
			friends.push({
				id: doc.id,
				name: data.name,
				email: data.email,
				phone: data.phone,
				birthday: data.birthday,
				notes: data.notes,
				createdAt:
					data.createdAt?.toDate()?.toISOString() ||
					new Date().toISOString(),
				updatedAt:
					data.updatedAt?.toDate()?.toISOString() ||
					new Date().toISOString(),
				userId: data.userId,
			})
		})

		return friends
	},

	async addFriend(userId: string, friendData: FriendInput): Promise<string> {
		if (!db) throw new Error('Firebase not initialized')

		const now = Timestamp.now()
		const docRef = await addDoc(collection(db, FRIENDS_COLLECTION), {
			...friendData,
			userId,
			createdAt: now,
			updatedAt: now,
		})

		return docRef.id
	},

	async updateFriend(
		friendId: string,
		friendData: Partial<FriendInput>
	): Promise<void> {
		if (!db) throw new Error('Firebase not initialized')

		const friendRef = doc(db, FRIENDS_COLLECTION, friendId)
		await updateDoc(friendRef, {
			...friendData,
			updatedAt: Timestamp.now(),
		})
	},

	async deleteFriend(friendId: string): Promise<void> {
		if (!db) throw new Error('Firebase not initialized')

		const friendRef = doc(db, FRIENDS_COLLECTION, friendId)
		await deleteDoc(friendRef)
	},

	async getFriend(friendId: string): Promise<Friend | null> {
		if (!db) throw new Error('Firebase not initialized')

		const friendRef = doc(db, FRIENDS_COLLECTION, friendId)
		const snap = await getDoc(friendRef)
		if (!snap.exists()) return null

		const data = snap.data()
		return {
			id: snap.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			birthday: data.birthday,
			notes: data.notes,
			createdAt:
				data.createdAt?.toDate?.()?.toISOString() ||
				new Date().toISOString(),
			updatedAt:
				data.updatedAt?.toDate?.()?.toISOString() ||
				new Date().toISOString(),
			userId: data.userId,
		}
	},
}
