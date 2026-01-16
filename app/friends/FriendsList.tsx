'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'

export default function FriendsList() {
	const { user, saveSettings, settings, loading: authLoading } = useAuth()
	const { openModal, savedCount } = useFriendModal()
	const router = useRouter()

	const [friends, setFriends] = useState<Friend[]>([])
	const [friendsLoading, setFriendsLoading] = useState(true)
	const [error, setError] = useState('')

	const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	useEffect(() => {
		if (!settings) return
		setSortBy(settings.sortBy || 'name')
		setSortOrder(settings.sortOrder || 'asc')
	}, [settings])

	const loadFriends = async () => {
		if (!user) return
		try {
			setFriendsLoading(true)
			const data = await friendsService.getFriends(user.uid)
			setFriends(data)
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to load friends')
		} finally {
			setFriendsLoading(false)
		}
	}

	useEffect(() => {
		if (authLoading) return
		if (!user) {
			router.push('/auth/login')
			return
		}
		void loadFriends()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, router, authLoading])

	useEffect(() => {
		// refresh when modal saved
		void loadFriends()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [savedCount])

	const handleSaveSettings = async (
		newSortBy: 'name' | 'createdAt',
		newSortOrder: 'asc' | 'desc'
	) => {
		try {
			await saveSettings({ sortBy: newSortBy, sortOrder: newSortOrder })
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to save settings')
		}
	}

	const applySort = (list: Friend[]) => {
		const copy = [...list]
		copy.sort((a, b) => {
			if (sortBy === 'name') {
				const na = a.name || ''
				const nb = b.name || ''
				const cmp = na.localeCompare(nb, undefined, {
					sensitivity: 'base',
				})
				return sortOrder === 'asc' ? cmp : -cmp
			}
			const da = Date.parse(a.createdAt || '') || 0
			const db = Date.parse(b.createdAt || '') || 0
			const cmp = da - db
			return sortOrder === 'asc' ? cmp : -cmp
		})
		return copy
	}

	const handleEdit = (friend: Friend) => {
		openModal(friend)
	}

	const handleDelete = async (friendId: string) => {
		if (!confirm('Are you sure you want to delete this friend?')) return
		try {
			await friendsService.deleteFriend(friendId)
			await loadFriends()
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to delete friend')
		}
	}

	if (friendsLoading) {
		return (
			<div className='text-center py-12'>
				<div className='text-zinc-600 dark:text-zinc-400 text-lg'>
					Loading...
				</div>
			</div>
		)
	}

	return (
		<>
			{error && (
				<div className='mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded'>
					{error}
				</div>
			)}

			<div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<label className='text-sm text-zinc-700 dark:text-zinc-300'>
						Sort:
					</label>
					<select
						value={sortBy}
						onChange={(e) => {
							const v = e.target.value as 'name' | 'createdAt'
							setSortBy(v)
							void handleSaveSettings(v, sortOrder)
						}}
						className='px-2 py-1 border rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
					>
						<option value='name'>Name</option>
						<option value='createdAt'>Date added</option>
					</select>
					<select
						value={sortOrder}
						onChange={(e) => {
							const v = e.target.value as 'asc' | 'desc'
							setSortOrder(v)
							void handleSaveSettings(sortBy, v)
						}}
						className='px-2 py-1 border rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
					>
						<option value='asc'>Ascending</option>
						<option value='desc'>Descending</option>
					</select>
				</div>

				{/* Add Friend Button is handled in BottomNav */}
			</div>

			{applySort(friends).length === 0 ? (
				<div className='text-center py-12'>
					<p className='text-zinc-600 dark:text-zinc-400 text-lg'>
						No friends yet. Add your first friend!
					</p>
				</div>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{applySort(friends).map((friend) => (
						<div
							key={friend.id}
							className='card p-6 dark:bg-zinc-900 hover:shadow-lg transition-shadow'
						>
							<h3
								className='text-lg font-semibold mb-2'
								style={{ color: 'var(--color-primary)' }}
							>
								{friend.name}
							</h3>
							{friend.email && (
								<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-1'>
									📧 {friend.email}
								</p>
							)}
							{friend.phone && (
								<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-1'>
									📱 {friend.phone}
								</p>
							)}
							{friend.birthday && (
								<p className='text-sm text-zinc-600 dark:text-zinc-400 mb-1'>
									🎂{' '}
									{(() => {
										try {
											return new Date(
												friend.birthday
											).toLocaleDateString()
										} catch {
											return friend.birthday
										}
									})()}
								</p>
							)}
							{friend.notes && (
								<p className='text-sm text-zinc-600 dark:text-zinc-400 mt-3 italic'>
									{friend.notes}
								</p>
							)}
							<div className='mt-4 flex gap-2'>
								<button
									onClick={() => handleEdit(friend)}
									className='flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800'
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(friend.id)}
									className='flex-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800'
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	)
}
