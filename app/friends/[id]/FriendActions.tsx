'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { friendsService } from '@/lib/friendsService'
import { Friend } from '@/types/friend'
import { useFriendModal } from '@/contexts/FriendModalContext'

type Props = {
	friend: Friend
}

export default function FriendActions({ friend }: Props) {
	const { openModal } = useFriendModal()
	const router = useRouter()

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this friend?')) return
		try {
			await friendsService.deleteFriend(friend.id)
			router.push('/friends')
		} catch (err) {
			const e = err as Error
			alert(e.message || 'Failed to delete friend')
		}
	}

	return (
		<>
			<Button variant='secondary' onClick={() => openModal(friend)}>
				Edit
			</Button>
			<Button variant='destructive' onClick={handleDelete}>
				Delete
			</Button>
			<Link href='/friends' className='ml-auto text-sm text-blue-600'>
				Back
			</Link>
		</>
	)
}
