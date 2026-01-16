'use client'

import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'
import Button from './Button'

export default function BottomNav() {
	const router = useRouter()

	return (
		<footer
			className='fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 z-40'
			style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<nav className='flex items-center justify-between h-16'>
					<button
						type='button'
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/')
						}}
						className='flex-1 flex flex-col items-center text-xs text-zinc-700 dark:text-zinc-300'
						aria-label='Home'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							className='w-6 h-6 mb-1'
						>
							<path
								fill='currentColor'
								d='M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z'
							/>
						</svg>
						<span>Home</span>
					</button>

					<button
						type='button'
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/friends')
						}}
						className='flex-1 flex flex-col items-center text-xs text-zinc-700 dark:text-zinc-300'
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

					<div className='-mt-6'>
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

					<button
						type='button'
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							void router.push('/settings')
						}}
						className='flex-1 flex flex-col items-center text-xs text-zinc-700 dark:text-zinc-300'
						aria-label='Settings'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							className='w-6 h-6 mb-1'
						>
							<path
								fill='currentColor'
								d='M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm8.94-3.5a7.98 7.98 0 0 0-.13-1.45l2.06-1.6-2-3.46-2.44.98A8.07 8.07 0 0 0 15.8 2h-3.6a8.07 8.07 0 0 0-1.53 4.47L8.13 5.5 5.69 3.54 3.69 7l2.06 1.6c-.05.48-.05.97 0 1.45L3.69 11.65 5.69 15.1l2.44-.98c.57 1.87 1.72 3.36 3.25 4.34A8.07 8.07 0 0 0 12.2 22h3.6a8.07 8.07 0 0 0 1.53-4.47l2.44.98 2-3.46-2.06-1.6z'
							/>
						</svg>
						<span>Settings</span>
					</button>

					<div className='flex-1 flex items-center justify-center'>
						<UserMenu />
					</div>
				</nav>
			</div>
		</footer>
	)
}
