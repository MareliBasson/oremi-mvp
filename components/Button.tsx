'use client'

import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'ghost'
	size?: 'sm' | 'md' | 'lg'
}

export default function Button({
	variant = 'primary',
	size = 'md',
	className = '',
	children,
	...rest
}: ButtonProps) {
	const sizes: Record<string, string> = {
		sm: 'px-3 py-1 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg',
	}

	const base =
		'inline-flex items-center justify-center rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2'

	const variantStyle =
		variant === 'primary'
			? 'text-white'
			: 'bg-transparent text-zinc-800 dark:text-zinc-200'

	const style: React.CSSProperties =
		variant === 'primary'
			? {
					backgroundColor: 'var(--color-primary)',
					boxShadow: 'var(--shadow-soft)',
					borderRadius: 'var(--radius-lg)',
			  }
			: { borderRadius: 'var(--radius-lg)' }

	return (
		<button
			{...rest}
			style={style}
			className={`${base} ${variantStyle} ${sizes[size]} ${className}`}
		>
			{children}
		</button>
	)
}
