'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

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
		<div className='flex items-center gap-2'>
			<Button
				variant='ghost'
				size='icon-sm'
				aria-label='Switch to light theme'
				onClick={() => setTheme('light')}
				title='Light'
			>
				<Sun className='size-4 text-zinc-700 dark:text-zinc-400' />
			</Button>

			<Switch
				size='sm'
				checked={current === 'dark'}
				onCheckedChange={(checked) =>
					setTheme(checked ? 'dark' : 'light')
				}
				aria-label='Toggle theme'
			/>

			<Button
				variant='ghost'
				size='icon-sm'
				aria-label='Switch to dark theme'
				onClick={() => setTheme('dark')}
				title='Dark'
			>
				<Moon className='size-4 text-zinc-700 dark:text-zinc-400' />
			</Button>
		</div>
	)
}
