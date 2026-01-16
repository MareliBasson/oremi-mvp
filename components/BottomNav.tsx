'use client'

import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'
import Button from './Button'
import { useAuth } from '@/contexts/AuthContext'

export default function BottomNav() {
	const router = useRouter()
	const { logout } = useAuth()

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
				<nav className='flex items-center justify-between h-16 relative'>
					<button
						type='button'
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/friends')
						}}
						className='w-1/4 flex flex-col items-center text-xs text-zinc-700 dark:text-zinc-300'
						aria-label='Friends'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							className='w-6 h-6 mb-1'
						>
							<path
								fill='currentColor'
								d='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0H4z'
							/>
						</svg>
						<span>Friends</span>
					</button>

					<div className='absolute left-0 right-0 flex justify-center -mt-6 pointer-events-none'>
						<div className='pointer-events-auto'>
							<Button
								onClick={(e) => {
									e?.stopPropagation()
									void router.push('/friends?showForm=true')
								}}
								size='lg'
								className='rounded-full'
							>
								+
							</Button>
						</div>
					</div>

					<div className='w-1/4 flex items-center justify-end gap-3'>
						<UserMenu />
						<button
							type='button'
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								void handleLogout()
							}}
							className='p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none'
							title='Logout'
							aria-label='Logout'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								className='w-5 h-5 text-zinc-700 dark:text-zinc-300'
							>
								<path d='M16 13v-2H7V8l-5 4 5 4v-3z' />
								<path d='M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z' />
							</svg>
						</button>
					</div>
				</nav>
			</div>
		</footer>
	)
}
