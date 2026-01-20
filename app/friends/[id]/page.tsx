'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'
import { timeAgo, avatarGradient, initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FriendPage() {
	const params = useParams() as { id?: string }
	const id = params?.id
	const router = useRouter()
	const { user, loading: authLoading } = useAuth()
	const { openModal } = useFriendModal()

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
		<div className='max-w-2xl mx-auto py-8'>
			<Card>
				<CardHeader>
					<div className='flex flex-col items-center gap-2 py-6'>
						<Avatar className='w-32 h-32'>
							<AvatarFallback
								style={{
									background: avatarGradient(
										`${friend.firstName} ${
											friend.lastName || ''
										}`
									),
								}}
								className='w-32 h-32 text-2xl'
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
								👀 Last seen {timeAgo(friend.lastSeen)}
							</CardDescription>
						) : (
							<CardDescription className='text-sm text-muted-foreground'>
								—
							</CardDescription>
						)}
					</div>
				</CardHeader>
				<Separator />
				<CardContent>
					<div className='space-y-2'>
						<p className='text-sm'>
							<span className='font-semibold'>Email:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.email || '—'}
							</span>
						</p>
						<p className='text-sm'>
							<span className='font-semibold'>Phone:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.phone || '—'}
							</span>
						</p>
						<p className='text-sm'>
							<span className='font-semibold'>Birthday:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.birthday
									? new Date(
											friend.birthday
									  ).toLocaleDateString()
									: '—'}
							</span>
						</p>
						<p className='text-sm'>
							<span className='font-semibold'>Last seen:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.lastSeen
									? `👀 ${timeAgo(friend.lastSeen)}`
									: '—'}
							</span>
						</p>
						<div>
							<p className='font-semibold mb-1'>Notes</p>
							<div className='text-sm text-muted-foreground italic'>
								{friend.notes || '—'}
							</div>
						</div>
						<p className='text-sm'>
							<span className='font-semibold'>Created:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.createdAt
									? new Date(
											friend.createdAt
									  ).toLocaleString()
									: '—'}
							</span>
						</p>
						<p className='text-sm'>
							<span className='font-semibold'>Updated:</span>{' '}
							<span className='text-muted-foreground'>
								{friend.updatedAt
									? new Date(
											friend.updatedAt
									  ).toLocaleString()
									: '—'}
							</span>
						</p>
					</div>
				</CardContent>
				<CardFooter className='gap-2'>
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
