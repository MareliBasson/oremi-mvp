'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import {
	saveSettings,
	subscribeToSettings,
	type UserSettings,
} from '@/lib/settingsService'
import { toast } from 'sonner'

const INTERVALS: {
	value: 'seconds' | 'days' | 'weeks' | 'months'
	label: string
}[] = [
	{ value: 'seconds', label: 'Seconds' },
	{ value: 'days', label: 'Days' },
	{ value: 'weeks', label: 'Weeks' },
	{ value: 'months', label: 'Months' },
]

type CheckInSetting = NonNullable<UserSettings['checkInFrequency']>

export default function PreferencesCheckins() {
	const { user } = useAuth()
	const [intervalType, setIntervalType] =
		useState<CheckInSetting['interval']>('weeks')
	const [intervalAmount, setIntervalAmount] = useState<number>(1)
	const [enabled, setEnabled] = useState<boolean>(false)
	const [lastInterval, setLastInterval] =
		useState<CheckInSetting['interval']>('weeks')
	const [lastEvery, setLastEvery] = useState<number>(1)

	const saveIntervalAmount = useRef<number | null>(null)

	useEffect(() => {
		if (!user) return
		let unsub: (() => void) | undefined
		try {
			unsub = subscribeToSettings(user.uid, (settings) => {
				const frequency = settings.checkInFrequency as any
				const explicitEnabled =
					typeof settings.checkInEnabled === 'boolean'
						? settings.checkInEnabled
						: undefined
				if (frequency && typeof frequency === 'object') {
					setIntervalType(frequency.interval)
					setIntervalAmount(frequency.every ?? 1)
					setEnabled(explicitEnabled ?? true)
					setLastInterval(frequency.interval)
					setLastEvery(frequency.every ?? 1)
				} else {
					// No explicit object-shaped frequency saved — default values
					setIntervalAmount(1)
					setEnabled(explicitEnabled ?? false)
				}
			})
		} catch (err) {
			console.error(err)
			toast.error('Failed to load preferences')
		}
		return () => unsub && unsub()
	}, [user])

	const handleIntervalChange = useCallback(
		async (intervalType: CheckInSetting['interval'], num: number) => {
			if (!user) return
			try {
				if (!intervalType) return
				if (!intervalType || (intervalType as string) === '') {
					await saveSettings(user.uid, { checkInEnabled: false })
				} else {
					await saveSettings(user.uid, {
						checkInFrequency: {
							interval: intervalType,
							every: Math.max(1, Math.floor(num)),
						},
						checkInEnabled: true,
					})
				}
				toast.success('Preferences saved')
			} catch (err) {
				console.error(err)
				toast.error('Failed to save preferences')
			}
		},
		[user]
	)

	const onIntervalTypeChange = useCallback(
		(intervalType: CheckInSetting['interval']) => {
			setIntervalType(intervalType)
			setEnabled(true)
			setLastInterval(intervalType)
			setLastEvery(intervalAmount)
			void handleIntervalChange(intervalType, intervalAmount)
		},
		[intervalAmount, handleIntervalChange]
	)

	const onIntervalAmountChange = useCallback(
		(n: number) => {
			const val = Math.max(1, Math.floor(n || 1))
			setIntervalAmount(val)
			setLastEvery(val)

			if (saveIntervalAmount.current) {
				window.clearTimeout(saveIntervalAmount.current)
			}

			saveIntervalAmount.current = window.setTimeout(() => {
				void handleIntervalChange(intervalType, val)
				saveIntervalAmount.current = null
			}, 600)
		},
		[intervalType, handleIntervalChange]
	)

	useEffect(() => {
		return () => {
			if (saveIntervalAmount.current)
				window.clearTimeout(saveIntervalAmount.current)
		}
	}, [])

	const handleCheckinToggle = useCallback(
		async (nextChecked: boolean) => {
			const next = Boolean(nextChecked)
			setEnabled(next)
			if (!next) {
				// preserve current selection as "last" before disabling
				setLastInterval(intervalType)
				setLastEvery(intervalAmount)
				try {
					if (!user) return
					await saveSettings(user.uid, { checkInEnabled: false })
					toast.success('Preferences saved')
				} catch (err) {
					console.error(err)
					toast.error('Failed to save preferences')
				}
			} else {
				setIntervalType(lastInterval)
				setIntervalAmount(lastEvery)
				void handleIntervalChange(lastInterval, lastEvery)
			}
		},
		[
			intervalAmount,
			intervalType,
			lastEvery,
			lastInterval,
			handleIntervalChange,
			user,
		]
	)

	return (
		<div className='py-2'>
			<div className='flex items-center justify-between'>
				<div className='text-sm font-semibold'>
					Enable check-in reminders
				</div>
				<div>
					<Switch
						checked={enabled}
						onCheckedChange={handleCheckinToggle}
					/>
				</div>
			</div>

			<div className='w-full mt-3 flex items-start justify-between'>
				<div className='text-sm text-muted-foreground max-w-prose'>
					How often would you like to be reminded to check in with
					your friends?
				</div>

				<div className='flex items-center justify-between gap-3 ml-6'>
					<Input
						type='number'
						min={1}
						value={intervalAmount}
						onChange={(e) =>
							onIntervalAmountChange(Number(e.target.value))
						}
						disabled={!enabled}
						className={'w-18 ' + (!enabled ? 'opacity-50' : '')}
						aria-label='Number of intervals'
					/>

					<Select
						value={intervalType}
						onValueChange={(v) => onIntervalTypeChange(v as any)}
						disabled={!enabled}
					>
						<SelectTrigger className='min-w-[120px]'>
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
			</div>
		</div>
	)
}
