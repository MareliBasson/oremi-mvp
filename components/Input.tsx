'use client'

import React from 'react'

export type InputProps = React.ComponentPropsWithoutRef<'input'> & {
	label?: string
	error?: string
	inputClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, error, className = '', inputClassName = '', id, ...props },
		ref
	) => {
		const inputId = id || props.name

		return (
			<div className={className}>
				{label && (
					<label
						htmlFor={inputId}
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
					>
						{label}
					</label>
				)}
				<input
					id={inputId}
					ref={ref}
					{...props}
					className={`mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white ${inputClassName}`}
				/>
				{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
			</div>
		)
	}
)

Input.displayName = 'Input'

export default Input
