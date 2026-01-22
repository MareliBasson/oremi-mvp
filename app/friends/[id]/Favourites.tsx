'use client'

import React, { useState } from 'react'
import { Friend } from '@/types/friend'
import { friendsService } from '@/lib/friendsService'

type Props = {
	friend: Friend
	onChange: (f: Friend) => void
}

export default function Favourites({ friend, onChange }: Props) {
	const [newFav, setNewFav] = useState('')

	const removeAt = async (idx: number) => {
		const newList = (friend.favouriteThings || []).filter(
			(_, i) => i !== idx
		)
		try {
			await friendsService.updateFriend(friend.id, {
				favouriteThings: newList,
			})
			onChange({ ...friend, favouriteThings: newList })
		} catch (err) {
			const e = err as Error
			alert(e.message || 'Failed to remove favourite')
		}
	}

	const add = async () => {
		if (!newFav.trim()) return
		const updated = [...(friend.favouriteThings || []), newFav.trim()]
		try {
			await friendsService.updateFriend(friend.id, {
				favouriteThings: updated,
			})
			onChange({ ...friend, favouriteThings: updated })
			setNewFav('')
		} catch (err) {
			const e = err as Error
			alert(e.message || 'Failed to add favourite')
		}
	}

	return (
		<div>
			<p className='font-semibold mb-2'>Favourites</p>
			<div className='space-y-3'>
				{(friend.favouriteThings || []).length === 0 ? (
					<div className='text-sm text-muted-foreground'>
						No favourites added.
					</div>
				) : (
					<ul className='list-disc pl-5 space-y-2'>
						{(friend.favouriteThings || []).map((f, idx) => (
							<li
								key={idx}
								className='flex items-center justify-between'
							>
								<span className='text-sm'>{f}</span>
								<button
									className='text-sm text-red-600 hover:underline'
									onClick={() => void removeAt(idx)}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				)}

				<div className='mt-3 flex items-center gap-2'>
					<input
						type='text'
						placeholder='Add a favourite thing'
						value={newFav}
						onChange={(e) => setNewFav(e.target.value)}
						className='input input-sm flex-1'
					/>
					<button
						className='btn btn-primary'
						onClick={() => void add()}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	)
}
