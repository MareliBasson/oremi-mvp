'use client'

import React from 'react'
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
} from '@/components/ui/empty'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFriendModal } from '@/contexts/FriendModalContext'

type EmptyStateProps = {
	message?: string
}

export default function EmptyState({
	message = 'No friends yet. Add your first friend!',
}: EmptyStateProps) {
	const { openModal } = useFriendModal()
	return (
		<Empty className='py-12'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<UserPlus className='size-6' />
				</EmptyMedia>
				<EmptyContent>
					<EmptyTitle>No friends yet</EmptyTitle>
					<EmptyDescription>{message}</EmptyDescription>
					<Button
						variant='default'
						size='sm'
						className='mt-4'
						onClick={() => openModal()}
					>
						<UserPlus className='size-4 mr-2' />
						Add your first friend
					</Button>
				</EmptyContent>
			</EmptyHeader>
		</Empty>
	)
}
