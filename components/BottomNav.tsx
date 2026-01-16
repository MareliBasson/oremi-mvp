'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import IconButton from './IconButton'
import { useAuth } from '@/contexts/AuthContext'
import { useFriendModal } from '@/contexts/FriendModalContext'
import {
	UserGroupIcon,
	PlusIcon,
	ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function BottomNav() {
	const router = useRouter()
	const { logout } = useAuth()
	const { openModal } = useFriendModal()

	const handleLogout = async () => {
		try {
			await logout()
		} catch {
			// ignore
		}
		void router.push('/auth/login')
	}

	return (
		<footer
			className='fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 z-40'
			style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<nav className='flex items-center justify-center h-16 relative'>
					<IconButton
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/friends')
						}}
						icon={
							<UserGroupIcon
								className='w-full h-full text-zinc-700 dark:text-zinc-300'
								aria-hidden='true'
							/>
						}
						label='Friends'
					/>
					<IconButton
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/settings')
						}}
						icon={
							<UserCircleIcon
								className='w-full h-full text-zinc-700 dark:text-zinc-300'
								aria-hidden='true'
							/>
						}
						label='Account'
					/>
					<IconButton
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void handleLogout()
						}}
						icon={
							<ArrowRightOnRectangleIcon
								className='w-full h-full text-zinc-700 dark:text-zinc-300'
								aria-hidden='true'
							/>
						}
						label='Logout'
					/>

					<div className='absolute left-0 right-0 flex justify-end -mt-6 pointer-events-none'>
						<div className='pointer-events-auto'>
							<Button
								onClick={(e) => {
									e?.stopPropagation()
									openModal()
								}}
								size='lg'
								className='rounded-full'
							>
								<PlusIcon
									className='w-6 h-6'
									aria-hidden='true'
								/>
							</Button>
						</div>
					</div>
				</nav>
			</div>
		</footer>
	)
}
