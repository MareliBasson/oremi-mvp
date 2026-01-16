'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useFriendModal } from '@/contexts/FriendModalContext'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { Friend, FriendInput } from '@/types/friend'

export default function FriendFormModal() {
	const { isOpen, closeModal, editingFriend, notifySaved } = useFriendModal()
	const { user } = useAuth()
	const router = useRouter()

	const [formData, setFormData] = useState<FriendInput>({
		name: '',
		email: '',
		phone: '',
		birthday: '',
		notes: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (editingFriend) {
			setFormData({
				name: editingFriend.name || '',
				email: editingFriend.email || '',
				phone: editingFriend.phone || '',
				birthday: editingFriend.birthday || '',
				notes: editingFriend.notes || '',
			})
		} else {
			setFormData({
				name: '',
				email: '',
				phone: '',
				birthday: '',
				notes: '',
			})
		}
	}, [editingFriend, isOpen])

	const nameRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (isOpen) {
			// focus the name input when the modal opens
			setTimeout(() => nameRef.current?.focus(), 0)
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return setError('Not authenticated')
		try {
			setLoading(true)
			if (editingFriend) {
				await friendsService.updateFriend(editingFriend.id, formData)
			} else {
				await friendsService.addFriend(user.uid, formData)
			}
			notifySaved()
			void router.push('/friends')
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to save friend')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div
				className='absolute inset-0 bg-black/40'
				onClick={closeModal}
			/>
			<div className='relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-lg p-6'>
				<h2
					className='text-xl font-semibold mb-4'
					style={{ color: 'var(--color-primary)' }}
				>
					{editingFriend ? 'Edit Friend' : 'Add New Friend'}
				</h2>
				{error && <div className='mb-3 text-red-600'>{error}</div>}
				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Name *
						</label>
						<input
							ref={nameRef}
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className='w-full px-3 py-2 border rounded bg-white dark:bg-zinc-800'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Email
						</label>
						<input
							type='email'
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							className='w-full px-3 py-2 border rounded bg-white dark:bg-zinc-800'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Phone
						</label>
						<input
							value={formData.phone}
							onChange={(e) =>
								setFormData({
									...formData,
									phone: e.target.value,
								})
							}
							className='w-full px-3 py-2 border rounded bg-white dark:bg-zinc-800'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Birthday
						</label>
						<input
							type='date'
							value={formData.birthday}
							onChange={(e) =>
								setFormData({
									...formData,
									birthday: e.target.value,
								})
							}
							className='w-full px-3 py-2 border rounded bg-white dark:bg-zinc-800'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Notes
						</label>
						<textarea
							rows={3}
							value={formData.notes}
							onChange={(e) =>
								setFormData({
									...formData,
									notes: e.target.value,
								})
							}
							className='w-full px-3 py-2 border rounded bg-white dark:bg-zinc-800'
						/>
					</div>
					<div className='flex gap-2 mt-2'>
						<button
							type='submit'
							disabled={loading}
							className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md'
						>
							{loading
								? 'Saving...'
								: editingFriend
								? 'Update'
								: 'Add'}
						</button>
						<button
							type='button'
							onClick={closeModal}
							className='flex-1 px-4 py-2 bg-zinc-200 rounded-md'
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
