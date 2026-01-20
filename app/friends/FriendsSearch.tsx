'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

type FriendsSearchProps = {
	onSearch: (query: string) => void
	placeholder?: string
	value?: string
}

export default function FriendsSearch({
	onSearch,
	placeholder = 'Search friends',
	value,
}: FriendsSearchProps) {
	const [internalValue, setInternalValue] = useState(value ?? '')

	// Sync from parent `value` only when it changes.
	useEffect(() => {
		if (typeof value === 'string' && value !== internalValue) {
			setInternalValue(value)
		}
		// We intentionally only depend on `value` so typing (internalValue changes)
		// won't be overwritten until the parent actually updates `value`.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	useEffect(() => {
		const t = setTimeout(() => onSearch(internalValue.trim()), 250)
		return () => clearTimeout(t)
	}, [internalValue, onSearch])

	return (
		<div className='w-full max-w-sm'>
			<Input
				placeholder={placeholder}
				value={internalValue}
				onChange={(e) => setInternalValue(e.target.value)}
				aria-label='Search friends'
			/>
		</div>
	)
}
