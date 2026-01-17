'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export default function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const current = theme === 'system' ? resolvedTheme : theme

	// Avoid rendering theme-dependent content during SSR
	if (!mounted) return null

	return (
		<Button
			// variant='ghost'
			onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
			className='px-2 py-1 rounded border'
			aria-label='Toggle theme'
		>
			{current === 'dark' ? 'Light' : 'Dark'}
		</Button>
	)
}
