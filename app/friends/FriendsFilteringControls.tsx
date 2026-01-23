'use client'

import React from 'react'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Filter } from 'lucide-react'

export default function FriendsFilteringControls() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type='button'
					aria-label='Open filters'
					title='Filters'
					className='w-10 h-10 inline-flex items-center justify-center rounded border bg-white dark:bg-zinc-900 text-sm'
				>
					<Filter className='h-5 w-5' />
				</button>
			</DialogTrigger>

			<DialogContent className='max-w-[600px] w-full'>
				<DialogHeader>
					<DialogTitle>Filters & Sort</DialogTitle>
					<DialogDescription>
						Filters and sorting are temporarily disabled. We'll
						re-enable these controls later.
					</DialogDescription>
				</DialogHeader>

				<div className='min-h-[200px] mt-4 flex items-center justify-center'>
					<div className='text-sm text-muted-foreground'>
						Coming soon
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
