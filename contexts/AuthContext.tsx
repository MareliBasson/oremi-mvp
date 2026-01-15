'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
	User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	signInWithPopup,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth'
import { auth, googleProvider, getClientAuth } from '@/lib/firebase'
import {
	UserSettings,
	getSettings,
	saveSettings,
	subscribeToSettings,
} from '@/lib/settingsService'

interface AuthContextType {
	user: User | null
	loading: boolean
	signup: (email: string, password: string) => Promise<void>
	login: (email: string, password: string) => Promise<void>
	signInWithGoogle: () => Promise<void>
	settings: UserSettings | null
	saveSettings: (settings: UserSettings) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signup: async () => {},
	login: async () => {},
	signInWithGoogle: async () => {},
	settings: null,
	saveSettings: async () => {},
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
	const [settings, setSettings] = useState<UserSettings | null>(null)

	useEffect(() => {
		// initialize auth and set persistence on client
		try {
			const clientAuth = getClientAuth()
			// ensure auth state is persisted across reloads
			setPersistence(clientAuth, browserLocalPersistence).catch(() => {})

			let unsubSettings: (() => void) | undefined
			const unsubscribe = onAuthStateChanged(clientAuth, async (user) => {
				setUser(user)
				setLoading(false)

				// always clear any previous settings subscription before changing state
				if (unsubSettings) {
					try {
						unsubSettings()
					} catch (_) {
						// ignore unsubscribe errors
					}
					unsubSettings = undefined
				}

				if (user) {
					try {
						const s = await getSettings(user.uid)
						setSettings(s)
						// subscribe to live updates
						unsubSettings = subscribeToSettings(user.uid, (next) =>
							setSettings(next)
						)
					} catch (e) {
						setSettings(null)
					}
				} else {
					setSettings(null)
				}
			})

			return () => {
				unsubscribe()
				if (unsubSettings) unsubSettings()
			}
		} catch (e) {
			// running on server or auth not ready — ignore
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const signup = async (email: string, password: string) => {
		const clientAuth = getClientAuth()
		await createUserWithEmailAndPassword(clientAuth, email, password)
	}

	const login = async (email: string, password: string) => {
		const clientAuth = getClientAuth()
		await signInWithEmailAndPassword(clientAuth, email, password)
	}

	const logout = async () => {
		const clientAuth = getClientAuth()
		await signOut(clientAuth)
	}

	const signInWithGoogle = async () => {
		const clientAuth = getClientAuth()
		if (!googleProvider) throw new Error('Google provider not initialized')
		await signInWithPopup(clientAuth, googleProvider)
	}

	const saveSettingsForUser = async (newSettings: UserSettings) => {
		if (!user) throw new Error('No authenticated user')
		await saveSettings(user.uid, newSettings)
	}

	const value = {
		user,
		loading,
		signup,
		login,
		signInWithGoogle,
		settings,
		saveSettings: saveSettingsForUser,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
