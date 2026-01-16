'use client'

import { useRouter } from 'next/navigation'

export default function UserMenu() {
	const router = useRouter()

	return (
		<div>
			<button
				type='button'
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					void router.push('/settings')
				}}
				className='p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none'
				title='User preferences'
				aria-label='User preferences'
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
		</div>
	)
}
