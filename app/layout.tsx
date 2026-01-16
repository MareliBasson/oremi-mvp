import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { FriendModalProvider } from '@/contexts/FriendModalContext'
import FriendFormModal from '@/components/FriendFormModal'
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
					<FriendModalProvider>
						{children}
						<BottomNav />
						<FriendFormModal />
					</FriendModalProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
