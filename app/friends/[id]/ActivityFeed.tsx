'use client'
import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from '@/components/ui/hover-card'
import { timeAgo, avatarGradient, initials } from '@/lib/utils'
import { Friend } from '@/types/friend'

type Activity = {
	id: string
	date: string
	event: string
	participants: string[]
	notes?: string
}

type Props = {
	friend: Friend
}

export default function ActivityFeed({ friend }: Props) {
	// Mock activity data for the timeline (populated per-friend)
	const [activities, setActivities] = useState<
		Array<{
			id: string
			date: string
			event: string
			participants: string[]
			notes?: string
		}>
	>([])

	useEffect(() => {
		if (!friend) return
		// Example mock activities — in a real app these would come from a service
		setActivities([
			{
				id: 'a1',
				date: new Date().toISOString(),
				event: `Coffee with ${friend.firstName}`,
				participants: [friend.firstName],
			},
			{
				id: 'a2',
				date: new Date(
					Date.now() - 1000 * 60 * 60 * 24 * 3
				).toISOString(),
				event: 'Lunch',
				participants: [friend.firstName, 'Alex'],
			},
			{
				id: 'a3',
				date: new Date(
					Date.now() - 1000 * 60 * 60 * 24 * 20
				).toISOString(),
				event: 'Movie night',
				participants: [friend.firstName, 'Sam', 'Taylor'],
			},
		])
	}, [friend])

	const addTagsToActivity = (activityId: string) => {
		const toAdd = prompt('Add friend names (comma-separated) to tag:')
		if (!toAdd) return
		const names = toAdd
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
		if (!names.length) return
		setActivities((prev) =>
			prev.map((a) =>
				a.id === activityId
					? {
							...a,
							participants: Array.from(
								new Set([...a.participants, ...names])
							),
					  }
					: a
			)
		)
	}

	if (!activities || activities.length === 0) {
		return (
			<div className='text-sm text-muted-foreground'>
				No activity yet.
			</div>
		)
	}

	return (
		<ul className='border-l border-muted-foreground/20 pl-4 space-y-6'>
			{activities
				.sort((a, b) => +new Date(b.date) - +new Date(a.date))
				.map((act) => (
					<li key={act.id} className='relative'>
						<span className='absolute -left-2 top-1 w-3 h-3 rounded-full bg-background border border-muted-foreground' />
						<div className='pl-4'>
							<div className='mt-2'>
								<div className='text-xs text-muted-foreground'>
									{(() => {
										const d = new Date(act.date)
										const now = new Date()
										const days = Math.floor(
											(Date.UTC(
												now.getFullYear(),
												now.getMonth(),
												now.getDate()
											) -
												Date.UTC(
													d.getFullYear(),
													d.getMonth(),
													d.getDate()
												)) /
												(1000 * 60 * 60 * 24)
										)
										if (days > 7) {
											return d.toLocaleDateString(
												undefined,
												{
													day: '2-digit',
													month: 'long',
													year: '2-digit',
												}
											)
										}
										return timeAgo(act.date)
									})()}
								</div>
								<div className='text-sm font-semibold mt-1'>
									{act.event}
								</div>

								<div className='mt-2 flex items-center'>
									<div className='flex -space-x-2'>
										{act.participants.map((p) => (
											<HoverCard key={p}>
												<HoverCardTrigger asChild>
													<Link
														href={`/friends?q=${encodeURIComponent(
															p
														)}`}
														className='inline-block rounded-full ring-2 ring-background'
													>
														<Avatar className='w-8 h-8'>
															<AvatarFallback
																style={{
																	background:
																		avatarGradient(
																			p
																		),
																}}
																className='text-white font-semibold drop-shadow-md'
															>
																{initials(
																	p.split(
																		' '
																	)[0],
																	p
																		.split(
																			' '
																		)
																		.slice(
																			1
																		)
																		.join(
																			' '
																		)
																)}
															</AvatarFallback>
														</Avatar>
													</Link>
												</HoverCardTrigger>
												<HoverCardContent>
													<div className='font-semibold'>
														{p}
													</div>
												</HoverCardContent>
											</HoverCard>
										))}
									</div>
									<button
										onClick={() =>
											addTagsToActivity(act.id)
										}
										className='ml-3 text-sm text-blue-600 hover:underline'
									>
										Add tags
									</button>
								</div>
							</div>
						</div>
					</li>
				))}
		</ul>
	)
}
