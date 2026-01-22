'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import SettingsData from './SettingsData'
import Preferences from './Preferences'

export default function SettingsPage() {
	const { loading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) void router.push('/auth/login')
	}, [loading, user, router])

	useEffect(() => {
		// placeholder in case we want global errors here
		// kept for parity with prior behavior
		return () => {
			/* noop */
		}
	}, [])

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-lg text-zinc-600 dark:text-zinc-400'>
					Loading...
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-[680px] min-h-screen w-full mx-auto py-8 px-4'>
			<Card className='min-h-[600px]'>
				<CardHeader>
					<CardTitle>Account settings</CardTitle>
				</CardHeader>

				<CardContent className='p-6'>
					<Tabs defaultValue='preferences'>
						<TabsList className='w-full mb-6' variant='line'>
							<TabsTrigger value='preferences'>
								Preferences
							</TabsTrigger>
							<TabsTrigger value='backup'>Data</TabsTrigger>
						</TabsList>

						<TabsContent value='preferences'>
							<Preferences />
						</TabsContent>

						<TabsContent value='backup'>
							<SettingsData />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
