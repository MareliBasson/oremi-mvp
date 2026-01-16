'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'

export function Providers({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Render nothing on the server to avoid any theme-related attribute
	// mismatches between server and client. The ThemeProvider will mount
	// on the client and then apply the correct `class` on <html>.
	if (!mounted) return null

	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
			{children}
		</ThemeProvider>
	)
}

export default Providers
