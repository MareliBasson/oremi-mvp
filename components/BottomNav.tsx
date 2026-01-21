'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
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
			<div className='max-w-[680px] mx-auto'>
				<nav className='relative flex items-center justify-between h-16'>
					<div className='flex items-center gap-4'>
						<BottomNavIconButton
							ariaLabel='Friends'
							onAction={() => void router.push('/friends')}
							Icon={UserGroupIcon}
						/>

						<BottomNavIconButton
							ariaLabel='Settings'
							onAction={() => void router.push('/settings')}
							Icon={Cog8ToothIcon}
						/>

						<BottomNavIconButton
							ariaLabel='Logout'
							onAction={() => void handleLogout()}
							Icon={ArrowRightStartOnRectangleIcon}
						/>
					</div>
					<div className='flex items-center justify-end w-full'>
						<Button
							onClick={(e) => {
								e?.stopPropagation()
								openModal()
							}}
							size='lg'
							className='rounded-full w-12 h-12 '
						>
							<PlusIcon className='w-6 h-6' aria-hidden='true' />
						</Button>
					</div>
				</nav>
			</div>
		</footer>
	)
}

function BottomNavIconButton({
	Icon,
	ariaLabel,
	onAction,
	iconClassName = 'text-zinc-700 dark:text-zinc-300',
}: {
	Icon: React.ElementType
	ariaLabel: string
	onAction?: () => void
	iconClassName?: string
}) {
	return (
		<Button
			variant='outline'
			size='lg'
			onClick={(e) => {
				e?.preventDefault()
				e?.stopPropagation()
				onAction && onAction()
			}}
			className='rounded-full w-12 h-12 p-0 flex items-center justify-center'
			aria-label={ariaLabel}
		>
			<Icon className={iconClassName} aria-hidden='true' />
		</Button>
	)
}
