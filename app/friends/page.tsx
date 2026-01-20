'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import FriendsList from './FriendsList'
import { useRouter } from 'next/navigation'

export default function FriendsPage() {
	const { loading: authLoading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!authLoading && !user) {
			void router.push('/auth/login')
		}
	}, [authLoading, user, router])

	if (authLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-lg text-zinc-600 dark:text-zinc-400'>
					Loading...
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<FriendsList />
			</main>
		</div>
	)
}
