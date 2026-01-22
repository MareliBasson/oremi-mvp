'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'
import { timeAgo, avatarGradient, initials } from '@/lib/utils'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import PersonalInfo from './PersonalInfo'
import Notes from './Notes'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ActivityFeed from './ActivityFeed'

export default function FriendPage() {
	const params = useParams() as { id?: string }
	const id = params?.id
	const router = useRouter()
	const { user, loading: authLoading } = useAuth()
	const { openModal } = useFriendModal()

	const [friend, setFriend] = useState<Friend | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')

	// Mock activity data for the timeline (populated per-friend)
	const [activities, setActivities] = useState<
		Array<{
			id: string
			date: string
			event: string
			participants: string[]
			notes?: string
		}>
	>([])

	const [newFav, setNewFav] = useState('')

	useEffect(() => {
		if (!friend) return
		// Example mock activities — in a real app these would come from a service
		setActivities([
			{
				id: 'a1',
				date: new Date().toISOString(),
				event: `Coffee with ${friend.firstName}`,
				participants: [friend.firstName],
			},
			{
				id: 'a2',
				date: new Date(
					Date.now() - 1000 * 60 * 60 * 24 * 3
				).toISOString(),
				event: 'Lunch',
				participants: [friend.firstName, 'Alex'],
			},
			{
				id: 'a3',
				date: new Date(
					Date.now() - 1000 * 60 * 60 * 24 * 20
				).toISOString(),
				event: 'Movie night',
				participants: [friend.firstName, 'Sam', 'Taylor'],
			},
		])
	}, [friend])

	const addTagsToActivity = (activityId: string) => {
		const toAdd = prompt('Add friend names (comma-separated) to tag:')
		if (!toAdd) return
		const names = toAdd
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
		if (!names.length) return
		setActivities((prev) =>
			prev.map((a) =>
				a.id === activityId
					? {
							...a,
							participants: Array.from(
								new Set([...a.participants, ...names])
							),
					  }
					: a
			)
		)
	}

	useEffect(() => {
		if (authLoading) return
		if (!user) {
			router.push('/auth/login')
			return
		}

		if (!id) {
			setError('Missing friend id')
			setLoading(false)
			return
		}

		let cancelled = false
		const load = async () => {
			setLoading(true)
			try {
				const data = await friendsService.getFriend(id)
				if (cancelled) return
				if (!data) {
					setError('Friend not found')
				} else if (data.userId !== user.uid) {
					setError('Not authorized to view this friend')
				} else {
					setFriend(data)
				}
			} catch (err) {
				const e = err as Error
				setError(e.message || 'Failed to load friend')
			} finally {
				setLoading(false)
			}
		}

		void load()

		return () => {
			cancelled = true
		}
	}, [id, user, authLoading, router])

	const handleEdit = () => {
		if (!friend) return
		openModal(friend)
	}

	const handleDelete = async () => {
		if (!friend) return
		if (!confirm('Are you sure you want to delete this friend?')) return
		try {
			await friendsService.deleteFriend(friend.id)
			router.push('/friends')
		} catch (err) {
			const e = err as Error
			setError(e.message || 'Failed to delete friend')
		}
	}

	if (loading) {
		return <div className='text-center py-12'>Loading...</div>
	}

	if (error) {
		return (
			<div className='max-w-xl mx-auto py-12'>
				<div className='mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded'>
					{error}
				</div>
				<Link href='/friends' className='text-sm text-blue-600'>
					Back to friends
				</Link>
			</div>
		)
	}

	if (!friend) return null

	return (
		<div className='min-h-screen max-w-2xl mx-auto py-8'>
			<Card className='pb-0'>
				<CardHeader>
					<div className='flex flex-col items-center gap-2 py-6'>
						<Avatar className='w-24 h-24'>
							<AvatarFallback
								style={{
									background: avatarGradient(
										`${friend.firstName} ${
											friend.lastName || ''
										}`
									),
								}}
								className='w-24 h-24 text-3xl font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]'
							>
								{initials(friend.firstName, friend.lastName)}
							</AvatarFallback>
						</Avatar>
						<CardTitle className='mt-2 text-center text-2xl'>
							{`${friend.firstName}${
								friend.lastName ? ' ' + friend.lastName : ''
							}`}
						</CardTitle>
						{friend.lastSeen ? (
							<CardDescription className='text-sm text-muted-foreground'>
								Last seen {timeAgo(friend.lastSeen)}
							</CardDescription>
						) : (
							<CardDescription className='text-sm text-muted-foreground'>
								—
							</CardDescription>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue='info'>
						<TabsList variant='line' className='w-full mb-6'>
							<TabsTrigger value='info'>Info</TabsTrigger>
							<TabsTrigger value='notes'>Notes</TabsTrigger>
							<TabsTrigger value='activity'>Activity</TabsTrigger>
							<TabsTrigger value='favourites'>
								Favourite things
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value='info'
							className='min-h-[200px] px-2 mb-5'
						>
							<PersonalInfo friend={friend} />
						</TabsContent>

						<TabsContent
							value='notes'
							className='min-h-[200px] px-2 mb-5'
						>
							<Notes friend={friend} />
						</TabsContent>

						<TabsContent
							value='activity'
							className='min-h-[200px] px-2 mb-5'
						>
							<ActivityFeed
								activities={activities}
								onAddTags={addTagsToActivity}
							/>
						</TabsContent>

						<TabsContent
							value='favourites'
							className='min-h-[200px] px-2 mb-5'
						>
							<div>
								<p className='font-semibold mb-2'>
									Favourite things
								</p>
								<div className='space-y-3'>
									{(friend.favouriteThings || []).length ===
									0 ? (
										<div className='text-sm text-muted-foreground'>
											No favourites added.
										</div>
									) : (
										<ul className='list-disc pl-5 space-y-2'>
											{(friend.favouriteThings || []).map(
												(f, idx) => (
													<li
														key={idx}
														className='flex items-center justify-between'
													>
														<span className='text-sm'>
															{f}
														</span>
														<button
															className='text-sm text-red-600 hover:underline'
															onClick={async () => {
																const newList =
																	(
																		friend.favouriteThings ||
																		[]
																	).filter(
																		(
																			_,
																			i
																		) =>
																			i !==
																			idx
																	)
																try {
																	await friendsService.updateFriend(
																		friend.id,
																		{
																			favouriteThings:
																				newList,
																		}
																	)
																	setFriend({
																		...friend,
																		favouriteThings:
																			newList,
																	})
																} catch (err) {
																	const e =
																		err as Error
																	alert(
																		e.message ||
																			'Failed to remove favourite'
																	)
																}
															}}
														>
															Remove
														</button>
													</li>
												)
											)}
										</ul>
									)}

									<div className='mt-3 flex items-center gap-2'>
										<input
											type='text'
											placeholder='Add a favourite thing'
											value={newFav}
											onChange={(e) =>
												setNewFav(e.target.value)
											}
											className='input input-sm flex-1'
										/>
										<button
											className='btn btn-primary'
											onClick={async () => {
												if (!newFav.trim()) return
												const updated = [
													...(friend.favouriteThings ||
														[]),
													newFav.trim(),
												]
												try {
													await friendsService.updateFriend(
														friend.id,
														{
															favouriteThings:
																updated,
														}
													)
													setFriend({
														...friend,
														favouriteThings:
															updated,
													})
													setNewFav('')
												} catch (err) {
													const e = err as Error
													alert(
														e.message ||
															'Failed to add favourite'
													)
												}
											}}
										>
											Add
										</button>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className='gap-2 bg-accent py-4'>
					<Button variant='secondary' onClick={handleEdit}>
						Edit
					</Button>
					<Button variant='destructive' onClick={handleDelete}>
						Delete
					</Button>
					<Link
						href='/friends'
						className='ml-auto text-sm text-blue-600'
					>
						Back
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
