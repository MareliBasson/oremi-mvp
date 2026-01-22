'use client'

import React, { useEffect, useState } from 'react'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import {
	getSettings,
	saveSettings,
	subscribeToSettings,
	type UserSettings,
} from '@/lib/settingsService'
import { toast } from 'sonner'
import ThemeToggle from '@/components/ThemeToggle'

const OPTIONS: { value: UserSettings['checkInFrequency']; label: string }[] = [
	{ value: 'none', label: 'No reminders' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'biweekly', label: 'Every 2 weeks' },
	{ value: 'monthly', label: 'Monthly' },
]

export default function Preferences() {
	const { user } = useAuth()
	const [value, setValue] = useState<UserSettings['checkInFrequency']>('none')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!user) return
		let unsub: (() => void) | undefined
		try {
			unsub = subscribeToSettings(user.uid, (s) => {
				setValue(
					(s.checkInFrequency as UserSettings['checkInFrequency']) ||
						'none'
				)
				setLoading(false)
			})
		} catch (err) {
			console.error(err)
			toast.error('Failed to load preferences')
			setLoading(false)
		}
		return () => unsub && unsub()
	}, [user])

	const handleChange = async (v: UserSettings['checkInFrequency']) => {
		setValue(v)
		if (!user) return
		try {
			await saveSettings(user.uid, { checkInFrequency: v })
			toast.success('Preferences saved')
		} catch (err) {
			console.error(err)
			toast.error('Failed to save preferences')
		}
	}

	return (
		<div className='space-y-4'>
			<div className='py-4 flex items-center justify-between'>
				<div className='text-sm text-muted-foreground'>Theme</div>
				<ThemeToggle />
			</div>
			<div className='py-4 flex items-center justify-between'>
				<div>
					<div className='text-sm font-medium'>
						Check-in reminders
					</div>
					<div className='text-sm text-muted-foreground'>
						How often would you like to be reminded to check in with
						your friends?
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<div className='w-full flex'>
						<Label className='sr-only'>Check-in frequency</Label>
						<Select
							value={value}
							onValueChange={(v) => void handleChange(v as any)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position='popper' align='end'>
								{OPTIONS.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	)
}
