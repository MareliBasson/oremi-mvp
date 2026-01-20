import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'
import FriendCard, { ClickableFriendCard } from './FriendCard'
import FriendsFilteringControls from './FriendsFilteringControls'
import FriendsSearch from './FriendsSearch'
import EmptyState from './EmptyState'

export default function FriendsList() {
	const { user, saveSettings, settings, loading: authLoading } = useAuth()
	const { openModal, savedCount } = useFriendModal()
	const router = useRouter()

	const [friends, setFriends] = useState<Friend[]>([])
	const [displayFriends, setDisplayFriends] = useState<Friend[]>([])
	const [friendsLoading, setFriendsLoading] = useState(true)
	const [error, setError] = useState('')

	const loadFriends = async () => {
		if (!user) return
		try {
			setFriendsLoading(true)
			const data = await friendsService.getFriends(user.uid)
			setFriends(data)
			setDisplayFriends(data)
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

			{displayFriends.length === 0 ? (
				<EmptyState />
			) : (
				<>
					<div className='mb-6 max-w-[600px] w-full mx-auto flex justify-between items-start gap-4'>
						<div className='flex-1'>
							<FriendsSearch
								onSearch={(q) => {
									if (!q) return setDisplayFriends(friends)
									const query = q.toLowerCase()
									setDisplayFriends(
										friends.filter((f) =>
											[f.name, f.email, f.phone]
												.filter(Boolean)
												.some((v) =>
													v!
														.toLowerCase()
														.includes(query)
												)
										)
									)
								}}
							/>
						</div>

						<div>
							<FriendsFilteringControls
								friends={friends}
								onSorted={setDisplayFriends}
							/>
						</div>
					</div>
					<div className='max-w-[600px] grid gap-4 grid-cols-1  mx-auto'>
						{displayFriends.map((friend) => (
							<ClickableFriendCard
								key={friend.id}
								friend={friend}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</>
			)}
		</>
	)
}
