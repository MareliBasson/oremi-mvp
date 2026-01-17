'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'
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
					<CardTitle>{friend.name}</CardTitle>
				</CardHeader>
				<CardContent>
					{friend.email && <p className='mb-2'>📧 {friend.email}</p>}
					{friend.phone && <p className='mb-2'>📱 {friend.phone}</p>}
					{friend.birthday && (
						<p className='mb-2'>
							🎂 {new Date(friend.birthday).toLocaleDateString()}
						</p>
					)}
					{friend.notes && (
						<CardDescription className='mt-3 italic'>
							{friend.notes}
						</CardDescription>
					)}
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
