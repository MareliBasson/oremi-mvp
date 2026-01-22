'use client'

import React from 'react'
import PreferencesDisplay from './PreferencesDisplay'
import PreferencesCheckins from './PreferencesCheckins'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Preferences() {
	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader>
					<CardTitle>Display</CardTitle>
					<CardDescription>
						Customize how the app looks.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PreferencesDisplay />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Check-in reminders</CardTitle>
					<CardDescription>
						Control reminder frequency and enable/disable
						notifications.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PreferencesCheckins />
				</CardContent>
			</Card>
		</div>
	)
}
