'use client'

export default function Loading() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4'>
			<div className='text-center'>
				<h1 className='text-4xl font-extrabold text-zinc-900 dark:text-white'>
					Oremi
				</h1>
				<p className='mt-2 text-zinc-600 dark:text-zinc-400'>
					Loading...
				</p>
			</div>
		</div>
	)
}
