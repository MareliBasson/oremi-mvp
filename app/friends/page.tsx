'use client'

import { useAuth } from '@/contexts/AuthContext'
import FriendsList from './FriendsList'

export default function FriendsPage() {
	const { loading: authLoading } = useAuth()

	if (authLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950'>
				<div className='text-lg text-zinc-600 dark:text-zinc-400'>
					Loading...
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
			{/* Header */}
			<header className='bg-white dark:bg-zinc-900 shadow'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
					<h1
						className='text-2xl font-bold'
						style={{ color: 'var(--color-primary)' }}
					>
						My Friends
					</h1>
					<div className='flex items-center gap-3' />
				</div>
			</header>

			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<FriendsList />
			</main>
		</div>
	)
}
