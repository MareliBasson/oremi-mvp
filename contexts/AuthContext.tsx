'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
	User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	signInWithPopup,
	onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

interface AuthContextType {
	user: User | null
	loading: boolean
	signup: (email: string, password: string) => Promise<void>
	login: (email: string, password: string) => Promise<void>
	signInWithGoogle: () => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signup: async () => {},
	login: async () => {},
	signInWithGoogle: async () => {},
	logout: async () => {},
})

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!auth) return

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const signup = async (email: string, password: string) => {
		if (!auth) throw new Error('Firebase auth not initialized')
		await createUserWithEmailAndPassword(auth, email, password)
	}

	const login = async (email: string, password: string) => {
		if (!auth) throw new Error('Firebase auth not initialized')
		await signInWithEmailAndPassword(auth, email, password)
	}

	const logout = async () => {
		if (!auth) throw new Error('Firebase auth not initialized')
		await signOut(auth)
	}

	const signInWithGoogle = async () => {
		if (!auth || !googleProvider)
			throw new Error('Firebase auth not initialized')
		await signInWithPopup(auth, googleProvider)
	}

	const value = {
		user,
		loading,
		signup,
		login,
		signInWithGoogle,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
