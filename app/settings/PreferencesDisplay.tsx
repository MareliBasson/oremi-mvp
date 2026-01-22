'use client'

import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function PreferencesDisplay() {
	return (
		<div className='py-2'>
			<div className='py-4 flex items-center justify-between'>
				<div>
					<div className='text-sm font-medium'>Theme</div>
					<div className='text-sm text-muted-foreground'>
						Pick light or dark theme.
					</div>
				</div>
				<ThemeToggle />
			</div>
		</div>
	)
}
