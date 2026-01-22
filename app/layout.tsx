import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { FriendModalProvider } from '@/contexts/FriendModalContext'
import Providers from '@/components/ThemeProvider'
import FriendFormModal from '@/components/FriendFormModal'
import BottomNav from '@/components/BottomNav'
import { Toaster } from '@/components/ui/sonner'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
		<html lang='en' className={inter.variable}>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#0ea5a4' />
				<link rel='apple-touch-icon' href='/icons/icon-192.svg' />
			</head>
			<body className='antialiased'>
				<Providers>
					<Toaster />
					<AuthProvider>
						<FriendModalProvider>
							<div
								className=' bg-zinc-50 dark:bg-zinc-950'
								style={{
									paddingBottom:
										'calc(4rem + env(safe-area-inset-bottom))',
								}}
							>
								{children}
							</div>
							<BottomNav />
							<FriendFormModal />
						</FriendModalProvider>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	)
}
