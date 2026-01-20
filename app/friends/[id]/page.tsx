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
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
						</TabsList>

						<TabsContent
							value='info'
							className='min-h-[200px] px-2 mb-5'
						>
							<div className='space-y-2'>
								<p className='text-sm'>
									<span className='font-semibold'>
										Email:
									</span>{' '}
									<span className='text-muted-foreground'>
										{friend.email || '—'}
									</span>
								</p>
								<p className='text-sm'>
									<span className='font-semibold'>
										Phone:
									</span>{' '}
									<span className='text-muted-foreground'>
										{friend.phone || '—'}
									</span>
								</p>
								<p className='text-sm'>
									<span className='font-semibold'>
										Birthday:
									</span>{' '}
									<span className='text-muted-foreground'>
										{friend.birthday
											? new Date(
													friend.birthday
											  ).toLocaleDateString()
											: '—'}
									</span>
								</p>
							</div>
						</TabsContent>

						<TabsContent
							value='notes'
							className='min-h-[200px] px-2 mb-5'
						>
							<div>
								<p className='font-semibold mb-1'>Notes</p>
								<div className='text-sm text-muted-foreground italic'>
									{friend.notes || '—'}
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value='activity'
							className='min-h-[200px] px-2 mb-5'
						>
							{activities.length === 0 ? (
								<div className='text-sm text-muted-foreground'>
									No activity yet.
								</div>
							) : (
								<ul className='border-l border-muted-foreground/20 pl-4 space-y-6'>
									{activities
										.sort(
											(a, b) =>
												+new Date(b.date) -
												+new Date(a.date)
										)
										.map((act) => (
											<li
												key={act.id}
												className='relative'
											>
												<span className='absolute -left-2 top-1 w-3 h-3 rounded-full bg-background border border-muted-foreground' />
												<div className='pl-4'>
													<div className='mt-2'>
														<div className='text-xs text-muted-foreground'>
															{(() => {
																const d =
																	new Date(
																		act.date
																	)
																const now =
																	new Date()
																const days =
																	Math.floor(
																		(Date.UTC(
																			now.getFullYear(),
																			now.getMonth(),
																			now.getDate()
																		) -
																			Date.UTC(
																				d.getFullYear(),
																				d.getMonth(),
																				d.getDate()
																			)) /
																			(1000 *
																				60 *
																				60 *
																				24)
																	)
																if (days > 7) {
																	return d.toLocaleDateString(
																		undefined,
																		{
																			day: '2-digit',
																			month: 'long',
																			year: '2-digit',
																		}
																	)
																}
																return timeAgo(
																	act.date
																)
															})()}
														</div>
														<div className='text-sm font-semibold mt-1'>
															{act.event}
														</div>

														<div className='mt-2 flex items-center'>
															<div className='flex -space-x-2'>
																{act.participants.map(
																	(p) => (
																		<HoverCard
																			key={
																				p
																			}
																		>
																			<HoverCardTrigger
																				asChild
																			>
																				<Link
																					href={`/friends?q=${encodeURIComponent(
																						p
																					)}`}
																					className='inline-block rounded-full ring-2 ring-background'
																				>
																					<Avatar className='w-8 h-8'>
																						<AvatarFallback
																							style={{
																								background:
																									avatarGradient(
																										p
																									),
																							}}
																							className='text-white font-semibold drop-shadow-md'
																						>
																							{initials(
																								p.split(
																									' '
																								)[0],
																								p
																									.split(
																										' '
																									)
																									.slice(
																										1
																									)
																									.join(
																										' '
																									)
																							)}
																						</AvatarFallback>
																					</Avatar>
																				</Link>
																			</HoverCardTrigger>
																			<HoverCardContent>
																				<div className='font-semibold'>
																					{
																						p
																					}
																				</div>
																			</HoverCardContent>
																		</HoverCard>
																	)
																)}
															</div>
														</div>
													</div>
												</div>
											</li>
										))}
								</ul>
							)}
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
