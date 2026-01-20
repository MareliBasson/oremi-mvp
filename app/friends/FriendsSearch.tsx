'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

type FriendsSearchProps = {
	onSearch: (query: string) => void
	placeholder?: string
}

export default function FriendsSearch({
	onSearch,
	placeholder = 'Search friends',
}: FriendsSearchProps) {
	const [value, setValue] = useState('')

	useEffect(() => {
		const t = setTimeout(() => onSearch(value.trim()), 250)
		return () => clearTimeout(t)
	}, [value, onSearch])

	return (
		<div className='w-full max-w-sm'>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				aria-label='Search friends'
			/>
		</div>
	)
}
