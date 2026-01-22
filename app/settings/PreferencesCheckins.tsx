'use client'

import React, { useEffect, useState } from 'react'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import {
	saveSettings,
	subscribeToSettings,
	type UserSettings,
} from '@/lib/settingsService'
import { toast } from 'sonner'

const INTERVALS: {
	value: 'none' | 'days' | 'weeks' | 'months'
	label: string
}[] = [
	{ value: 'none', label: 'No reminders' },
	{ value: 'days', label: 'Days' },
	{ value: 'weeks', label: 'Weeks' },
	{ value: 'months', label: 'Months' },
]

type CheckInSetting = NonNullable<UserSettings['checkInFrequency']>

export default function PreferencesCheckins() {
	const { user } = useAuth()
	const [interval, setInterval] = useState<CheckInSetting['interval']>('none')
	const [every, setEvery] = useState<number>(1)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!user) return
		let unsub: (() => void) | undefined
		try {
			unsub = subscribeToSettings(user.uid, (s) => {
				const raw = s.checkInFrequency as any
				if (!raw) {
					setInterval('none')
					setEvery(1)
				} else if (typeof raw === 'string') {
					switch (raw) {
						case 'daily':
							setInterval('days')
							setEvery(1)
							break
						case 'weekly':
							setInterval('weeks')
							setEvery(1)
							break
						case 'biweekly':
							setInterval('weeks')
							setEvery(2)
							break
						case 'monthly':
							setInterval('months')
							setEvery(1)
							break
						default:
							setInterval('none')
							setEvery(1)
					}
				} else if (typeof raw === 'object') {
					setInterval(raw.interval || 'none')
					setEvery(raw.every ?? 1)
				}
				setLoading(false)
			})
		} catch (err) {
			console.error(err)
			toast.error('Failed to load preferences')
			setLoading(false)
		}
		return () => unsub && unsub()
	}, [user])

	const persist = async (intv: CheckInSetting['interval'], num: number) => {
		if (!user) return
		try {
			if (intv === 'none') {
				await saveSettings(user.uid, {
					checkInFrequency: { interval: 'none' },
				})
			} else {
				await saveSettings(user.uid, {
					checkInFrequency: {
						interval: intv,
						every: Math.max(1, Math.floor(num)),
					},
				})
			}
			toast.success('Preferences saved')
		} catch (err) {
			console.error(err)
			toast.error('Failed to save preferences')
		}
	}

	const onIntervalChange = (v: CheckInSetting['interval']) => {
		setInterval(v)
		if (v === 'none') void persist('none', 1)
		else void persist(v, every)
	}

	const onEveryChange = (n: number) => {
		const val = Math.max(1, Math.floor(n || 1))
		setEvery(val)
		void persist(interval, val)
	}

	return (
		<div className='py-4'>
			<div className='mb-2 text-sm font-semibold'>Check-in reminders</div>
			<div className='text-sm text-muted-foreground'>
				How often would you like to be reminded to check in with your
				friends?
			</div>

			<div className='mt-3 flex items-center gap-3'>
				<div className='min-w-[160px]'>
					<Select
						value={interval}
						onValueChange={(v) => onIntervalChange(v as any)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent position='popper' align='end'>
							{INTERVALS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{interval !== 'none' && (
					<div className='flex items-center gap-2'>
						<input
							type='number'
							min={1}
							value={every}
							onChange={(e) =>
								onEveryChange(Number(e.target.value))
							}
							className='input input-sm w-24'
						/>
						<div className='text-sm text-muted-foreground'>
							times
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
