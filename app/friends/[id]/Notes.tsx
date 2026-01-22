'use client'

import React from 'react'
import { Friend } from '@/types/friend'

type Props = {
	friend: Friend
}

export default function Notes({ friend }: Props) {
	return (
		<div>
			<p className='font-semibold mb-1'>Notes</p>
			<div className='text-sm text-muted-foreground italic'>
				{friend.notes || '—'}
			</div>
		</div>
	)
}
