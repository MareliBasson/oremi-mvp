import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'
import FriendCard from './FriendCard'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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
					<Label className='text-sm text-zinc-700 dark:text-zinc-300'>
						Sort:
					</Label>

					<Select
						value={sortBy}
						onValueChange={(v) => {
							const nv = v as 'name' | 'createdAt'
							setSortBy(nv)
							void handleSaveSettings(nv, sortOrder)
						}}
					>
						<SelectTrigger size='sm' className='min-w-[120px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='name'>Name</SelectItem>
							<SelectItem value='createdAt'>
								Date added
							</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={sortOrder}
						onValueChange={(v) => {
							const nv = v as 'asc' | 'desc'
							setSortOrder(nv)
							void handleSaveSettings(sortBy, nv)
						}}
					>
						<SelectTrigger size='sm' className='min-w-[120px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='asc'>Ascending</SelectItem>
							<SelectItem value='desc'>Descending</SelectItem>
						</SelectContent>
					</Select>
				</div>
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
						<FriendCard
							key={friend.id}
							friend={friend}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}
		</>
	)
}
