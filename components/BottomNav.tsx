'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import IconButton from './IconButton'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useFriendModal } from '@/contexts/FriendModalContext'
import {
	UserGroupIcon,
	Cog8ToothIcon,
	PlusIcon,
	ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline'

export default function BottomNav() {
	const router = useRouter()
	const { logout, user, loading } = useAuth()

	const { openModal } = useFriendModal()

	// don't render bottom navigation while auth is loading or when not logged in
	if (loading || !user) return null

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
			<div className='max-w-[600px] mx-auto'>
				<nav className='flex items-center justify-center h-16 relative'>
					<div className='absolute left-0 right-0 flex justify-start -mt-6 pointer-events-none'>
						<div className='pointer-events-auto'>
							<ThemeToggle />
						</div>
					</div>
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
							<Cog8ToothIcon
								className='w-full h-full text-zinc-700 dark:text-zinc-300'
								aria-hidden='true'
							/>
						}
						label='Settings'
					/>
					<IconButton
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void handleLogout()
						}}
						icon={
							<ArrowRightStartOnRectangleIcon
								className='w-full h-full text-zinc-700 dark:text-zinc-300'
								aria-hidden='true'
							/>
						}
						label='Logout'
					/>

					<div className='absolute left-0 right-0 flex items-center justify-end -mt-6 pointer-events-none'>
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
