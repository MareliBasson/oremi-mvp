'use client'

import React from 'react'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: React.ReactNode
	label?: string
}

export default function IconButton({
	icon,
	label,
	className = '',
	...rest
}: IconButtonProps) {
	return (
		<button
			{...rest}
			className={`w-20 flex flex-col items-center text-xs text-zinc-700 dark:text-zinc-300 ${className}`}
		>
			<span className='w-6 h-6 mb-1'>{icon}</span>
			{label ? <span className='text-[11px]'>{label}</span> : null}
		</button>
	)
}
