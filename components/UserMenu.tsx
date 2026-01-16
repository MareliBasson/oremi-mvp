'use client'

import { useRouter } from 'next/navigation'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function UserMenu() {
	const router = useRouter()

	return (
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
	)
}
