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
	const display = query && query.trim() ? query : 'your search'

	return (
		<Empty className='py-12 min-h-[40vh]'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<Search className='size-6' />
				</EmptyMedia>
				<EmptyContent>
					<EmptyTitle>No results</EmptyTitle>
					<EmptyDescription>
						No friends match <strong>"{display}"</strong>
					</EmptyDescription>
					{onClear ? (
						<div className='flex gap-2 mt-4'>
							<Button variant='ghost' size='sm' onClick={onClear}>
								Clear search
							</Button>
						</div>
					) : null}
				</EmptyContent>
			</EmptyHeader>
		</Empty>
	)
}
