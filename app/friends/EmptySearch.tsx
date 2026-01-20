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
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFriendModal } from '@/contexts/FriendModalContext'

type EmptySearchProps = {
	query?: string
	onClear?: () => void
}

export default function EmptySearch({ query = '', onClear }: EmptySearchProps) {
	const { openModal } = useFriendModal()

	return (
		<Empty className='py-12 min-h-[40vh]'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<Search className='size-6' />
				</EmptyMedia>
				<EmptyContent>
					<EmptyTitle>No results</EmptyTitle>
					<EmptyDescription>
						No friends match <strong>"{query}"</strong>.
					</EmptyDescription>
					<div className='flex gap-2 mt-4'>
						{onClear ? (
							<Button variant='ghost' size='sm' onClick={onClear}>
								Clear search
							</Button>
						) : null}

						<Button
							variant='default'
							size='sm'
							onClick={() => openModal()}
						>
							Add friend
						</Button>
					</div>
				</EmptyContent>
			</EmptyHeader>
		</Empty>
	)
}
