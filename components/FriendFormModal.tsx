'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from './ui/dialog'
import { useFriendModal } from '@/contexts/FriendModalContext'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { friendsService } from '@/lib/friendsService'
import { FriendInput } from '@/types/friend'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

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

	useEffect(() => {
		if (isOpen) {
			// focus the name input when the modal opens
			setTimeout(() => document.getElementById('friend-name')?.focus(), 0)
		}
	}, [isOpen])

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
			closeModal()
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to save friend')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editingFriend ? 'Edit Friend' : 'Add New Friend'}
					</DialogTitle>
					<DialogDescription>
						{error && (
							<div className='mb-3 text-red-600'>{error}</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<label className='block text-sm font-medium mb-1'>
							Name *
						</label>
						<Input
							id='friend-name'
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-1'>
							Email
						</label>
						<Input
							type='email'
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-1'>
							Phone
						</label>
						<Input
							value={formData.phone}
							onChange={(e) =>
								setFormData({
									...formData,
									phone: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-1'>
							Birthday
						</label>
						<Input
							type='date'
							value={formData.birthday}
							onChange={(e) =>
								setFormData({
									...formData,
									birthday: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-1'>
							Notes
						</label>
						<Textarea
							rows={3}
							value={formData.notes}
							onChange={(e) =>
								setFormData({
									...formData,
									notes: e.target.value,
								})
							}
						/>
					</div>

					<DialogFooter>
						<Button
							type='submit'
							disabled={loading}
							className='flex-1'
						>
							{loading
								? 'Saving...'
								: editingFriend
								? 'Update'
								: 'Add'}
						</Button>
						<DialogClose asChild>
							<Button
								type='button'
								variant='ghost'
								className='flex-1'
								onClick={closeModal}
							>
								Cancel
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
