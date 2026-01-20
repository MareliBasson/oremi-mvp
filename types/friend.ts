export interface Friend {
	id: string
	firstName: string
	lastName?: string
	email?: string
	phone?: string
	birthday?: string
	// ISO string when we last saw this friend
	lastSeen?: string
	notes?: string
	createdAt: string
	updatedAt: string
	userId: string
}

export interface FriendInput {
	firstName: string
	lastName?: string
	email?: string
	phone?: string
	birthday?: string
	notes?: string
	// optionally set lastSeen when creating/updating
	lastSeen?: string
}
