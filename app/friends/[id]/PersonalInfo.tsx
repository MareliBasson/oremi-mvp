'use client'

import React from 'react'
import { Friend } from '@/types/friend'

type Props = {
	friend: Friend
}

export default function PersonalInfo({ friend }: Props) {
	return (
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
						? new Date(friend.birthday).toLocaleDateString()
						: '—'}
				</span>
			</p>
		</div>
	)
}
