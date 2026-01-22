'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'

import { timeAgo, avatarGradient, initials } from '@/lib/utils'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

import ActivityFeed from './ActivityFeed'
import Favourites from './Favourites'
import FriendActions from './FriendActions'

export default function FriendPage() {
	const params = useParams() as { id?: string }
	const id = params?.id
	const router = useRouter()
	const { user, loading: authLoading } = useAuth()

	const [friend, setFriend] = useState<Friend | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')

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

	// TODO: Create a Friend not Found page
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
								Favourites
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
							<ActivityFeed friend={friend} />
						</TabsContent>

						<TabsContent
							value='favourites'
							className='min-h-[200px] px-2 mb-5'
						>
							<Favourites
								friend={friend}
								onChange={(f) => setFriend(f)}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>

				<CardFooter className='gap-2 bg-accent py-4'>
					<FriendActions friend={friend} />
				</CardFooter>
			</Card>
		</div>
	)
}
