'use client'

import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function PreferencesDisplay() {
	return (
		<div>
			<div className='mb-2 text-sm font-semibold'>Display</div>
			<div className='py-4 flex items-center justify-between'>
				<div className='text-sm text-muted-foreground'>Theme</div>
				<ThemeToggle />
			</div>
		</div>
	)
}
