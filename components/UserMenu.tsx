'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement | null>(null)
	const router = useRouter()
	const { logout } = useAuth()

	useEffect(() => {
		function onDocClick(e: MouseEvent) {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('click', onDocClick)
		return () => document.removeEventListener('click', onDocClick)
	}, [])

	const handleLogout = async () => {
		try {
			await logout()
			router.push('/auth/login')
		} catch (_) {
			router.push('/auth/login')
		}
	}

	return (
		<div className='relative' ref={ref}>
			<button
				aria-haspopup='true'
				aria-expanded={open}
				onClick={() => setOpen((s) => !s)}
				className='p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none'
				title='User menu'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='currentColor'
					className='w-6 h-6 text-zinc-700 dark:text-zinc-300'
				>
					<path
						fillRule='evenodd'
						d='M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9a8 8 0 1116 0H4z'
						clipRule='evenodd'
					/>
				</svg>
			</button>

			{open && (
				<div className='absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded shadow-lg z-50'>
					<button
						onClick={() => {
							setOpen(false)
							router.push('/settings')
						}}
						className='w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
					>
						Settings
					</button>
					<button
						onClick={() => {
							setOpen(false)
							void handleLogout()
						}}
						className='w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
					>
						Logout
					</button>
				</div>
			)}
		</div>
	)
}
