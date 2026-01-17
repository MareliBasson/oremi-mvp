'use client'

import React, { useEffect, useState } from 'react'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Friend } from '@/types/friend'
import { useAuth } from '@/contexts/AuthContext'

type SortControlsProps = {
	friends: Friend[]
	onSorted: (friends: Friend[]) => void
}

export default function SortControls({ friends, onSorted }: SortControlsProps) {
	const { saveSettings, settings } = useAuth()

	const [sortBy, setSortBy] = useState<'name' | 'createdAt'>(
		settings?.sortBy || 'name'
	)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
		settings?.sortOrder || 'asc'
	)

	useEffect(() => {
		if (settings) {
			setSortBy(settings.sortBy || 'name')
			setSortOrder(settings.sortOrder || 'asc')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings])

	useEffect(() => {
		const copy = [...friends]
		copy.sort((a, b) => {
			if (sortBy === 'name') {
				const na = a.name || ''
				const nb = b.name || ''
				const cmp = na.localeCompare(nb, undefined, {
					sensitivity: 'base',
				})
				return sortOrder === 'asc' ? cmp : -cmp
			}
			const da = Date.parse(a.createdAt || '') || 0
			const db = Date.parse(b.createdAt || '') || 0
			const cmp = da - db
			return sortOrder === 'asc' ? cmp : -cmp
		})
		onSorted(copy)
	}, [friends, sortBy, sortOrder, onSorted])

	const persistSettings = async (
		newSortBy: typeof sortBy,
		newSortOrder: typeof sortOrder
	) => {
		try {
			await saveSettings({ sortBy: newSortBy, sortOrder: newSortOrder })
		} catch (err) {
			// keep non-fatal: settings failing shouldn't break UI
			// eslint-disable-next-line no-console
			console.error('Failed to save sort settings', err)
		}
	}

	return (
		<div className='flex items-center gap-2'>
			<Label className='text-sm text-zinc-700 dark:text-zinc-300'>
				Sort:
			</Label>

			<Select
				value={sortBy}
				onValueChange={(v) => {
					const nv = v as 'name' | 'createdAt'
					setSortBy(nv)
					void persistSettings(nv, sortOrder)
				}}
			>
				<SelectTrigger size='sm' className='min-w-[120px]'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='name'>Name</SelectItem>
					<SelectItem value='createdAt'>Date added</SelectItem>
				</SelectContent>
			</Select>

			<Select
				value={sortOrder}
				onValueChange={(v) => {
					const nv = v as 'asc' | 'desc'
					setSortOrder(nv)
					void persistSettings(sortBy, nv)
				}}
			>
				<SelectTrigger size='sm' className='min-w-[120px]'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='asc'>Ascending</SelectItem>
					<SelectItem value='desc'>Descending</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
