'use client'

import React from 'react'
import { Friend } from '@/types/friend'
import { Button } from '@/components/ui/button'

type FriendCardProps = {
	friend: Friend
	onEdit: (friend: Friend) => void
	onDelete: (id: string) => void
}

export default function FriendCard({
	friend,
	onEdit,
	onDelete,
}: FriendCardProps) {
	return (
		<div className='card p-6 dark:bg-zinc-900 hover:shadow-lg transition-shadow'>
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
				<Button
					variant='secondary'
					size='sm'
					className='flex-1'
					onClick={() => onEdit(friend)}
				>
					Edit
				</Button>
				<Button
					variant='destructive'
					size='sm'
					className='flex-1'
					onClick={() => onDelete(friend.id)}
				>
					Delete
				</Button>
			</div>
		</div>
	)
}
