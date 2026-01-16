'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'
import Button from '@/components/Button'
import { friendsService } from '@/lib/friendsService'
import { Friend, FriendInput } from '@/types/friend'

export default function FriendsPage() {
	const [friends, setFriends] = useState<Friend[]>([])
	const [friendsLoading, setFriendsLoading] = useState(true)
	const [showForm, setShowForm] = useState(false)
	const [editingFriend, setEditingFriend] = useState<Friend | null>(null)
	const [error, setError] = useState('')
	const {
		user,
		logout,
		settings,
		saveSettings,
		loading: authLoading,
	} = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()

	const [formData, setFormData] = useState<FriendInput>({
		name: '',
		email: '',
		phone: '',
		birthday: '',
		notes: '',
	})

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

	// Local UI settings state (defaults)
	const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	// initialize sort preferences from user settings
	useEffect(() => {
		if (!settings) return
		setSortBy(settings.sortBy || 'name')
		setSortOrder(settings.sortOrder || 'asc')
	}, [settings])

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
			// createdAt
			const da = Date.parse(a.createdAt || '') || 0
			const db = Date.parse(b.createdAt || '') || 0
			const cmp = da - db
			return sortOrder === 'asc' ? cmp : -cmp
		})
		return copy
	}

	useEffect(() => {
		if (authLoading) return
		if (!user) {
			router.push('/auth/login')
			return
		}
		loadFriends()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, router, authLoading])

	useEffect(() => {
		if (!searchParams) return
		if (searchParams.get('showForm') === 'true') {
			setShowForm(true)
		}
	}, [searchParams])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		try {
			if (editingFriend) {
				await friendsService.updateFriend(editingFriend.id, formData)
			} else {
				await friendsService.addFriend(user.uid, formData)
			}
			await loadFriends()
			resetForm()
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to save friend')
		}
	}

	const handleEdit = (friend: Friend) => {
		setEditingFriend(friend)
		setFormData({
			name: friend.name,
			email: friend.email || '',
			phone: friend.phone || '',
			birthday: friend.birthday || '',
			notes: friend.notes || '',
		})
		setShowForm(true)
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

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			phone: '',
			birthday: '',
			notes: '',
		})
		setEditingFriend(null)
		setShowForm(false)
	}

	const handleLogout = async () => {
		try {
			await logout()
			router.push('/auth/login')
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to logout')
		}
	}

	if (authLoading || friendsLoading) {
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
								handleSaveSettings(v, sortOrder)
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
								handleSaveSettings(sortBy, v)
							}}
							className='px-2 py-1 border rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
						>
							<option value='asc'>Ascending</option>
							<option value='desc'>Descending</option>
						</select>
					</div>

					{/* Add Friend Button removed - handled by BottomNav + */}
				</div>

				{/* Friend Form */}
				{showForm && (
					<div className='mb-6 card dark:bg-zinc-900 p-6'>
						<h2
							className='text-xl font-semibold mb-4'
							style={{ color: 'var(--color-primary)' }}
						>
							{editingFriend ? 'Edit Friend' : 'Add New Friend'}
						</h2>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
									Name *
								</label>
								<input
									type='text'
									required
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
									Email
								</label>
								<input
									type='email'
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value,
										})
									}
									className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
									Phone
								</label>
								<input
									type='tel'
									value={formData.phone}
									onChange={(e) =>
										setFormData({
											...formData,
											phone: e.target.value,
										})
									}
									className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
									Birthday
								</label>
								<input
									type='date'
									value={formData.birthday}
									onChange={(e) =>
										setFormData({
											...formData,
											birthday: e.target.value,
										})
									}
									className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
									Notes
								</label>
								<textarea
									value={formData.notes}
									onChange={(e) =>
										setFormData({
											...formData,
											notes: e.target.value,
										})
									}
									rows={3}
									className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
								/>
							</div>
							<div className='flex gap-2'>
								<button
									type='submit'
									className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
								>
									{editingFriend ? 'Update' : 'Add'}
								</button>
								<button
									type='button'
									onClick={resetForm}
									className='flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 focus:outline-none'
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Friends List */}
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
			</main>
		</div>
	)
}
