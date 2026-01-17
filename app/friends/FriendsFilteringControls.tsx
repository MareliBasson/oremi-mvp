'use client'

import React from 'react'
import { Friend } from '@/types/friend'
import SortControls from './SortControls'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Filter } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type Props = {
	friends: Friend[]
	onSorted: (friends: Friend[]) => void
}

export default function FriendsFilteringControls({ friends, onSorted }: Props) {
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
						Choose how to sort and filter your friends list.
					</DialogDescription>
				</DialogHeader>

				<div className='min-h-[400px] mt-4 '>
					<Tabs defaultValue='sort'>
						<TabsList className='mb-4 w-full'>
							<TabsTrigger value='sort'>Sort</TabsTrigger>
							<TabsTrigger value='status'>Status</TabsTrigger>
							<TabsTrigger value='tags'>Tags</TabsTrigger>
						</TabsList>

						<TabsContent value='sort'>
							<SortControls
								friends={friends}
								onSorted={onSorted}
							/>
						</TabsContent>

						<TabsContent value='status'>
							<div className='text-sm text-muted-foreground'>
								Status filters will go here.
							</div>
						</TabsContent>

						<TabsContent value='tags'>
							<div className='text-sm text-muted-foreground'>
								Tag filters will go here.
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	)
}
