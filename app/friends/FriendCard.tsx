import React from 'react'
import { Friend } from '@/types/friend'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type FriendCardProps = {
	friend: Friend
	onEdit: (friend: Friend) => void
	onDelete: (id: string) => void
}

function formatDate(input?: string) {
	if (!input) return ''
	try {
		return new Date(input).toLocaleDateString()
	} catch {
		return input
	}
}

export default function FriendCard({
	friend,
	onEdit,
	onDelete,
}: FriendCardProps) {
	return (
		<Card className='hover:shadow-lg transition-shadow'>
			<CardHeader>
				<CardTitle>{friend.name}</CardTitle>
			</CardHeader>

			<CardContent>
				{friend.email && (
					<p className='text-sm text-muted-foreground mb-1'>
						📧 {friend.email}
					</p>
				)}

				{friend.phone && (
					<p className='text-sm text-muted-foreground mb-1'>
						📱 {friend.phone}
					</p>
				)}

				{friend.birthday && (
					<p className='text-sm text-muted-foreground mb-1'>
						🎂 {formatDate(friend.birthday)}
					</p>
				)}

				{friend.notes && (
					<CardDescription className='mt-3 italic'>
						{friend.notes}
					</CardDescription>
				)}
			</CardContent>

			<CardFooter className='mt-2 gap-2'>
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
			</CardFooter>
		</Card>
	)
}
