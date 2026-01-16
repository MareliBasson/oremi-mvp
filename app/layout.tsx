import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
	title: 'Friends Database',
	description: 'A mobile-first app for managing your friends',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className='antialiased'>
				<AuthProvider>
					{children}
					<BottomNav />
				</AuthProvider>
			</body>
		</html>
	)
}
