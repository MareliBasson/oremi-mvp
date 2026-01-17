'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
	const { settings, saveSettings, loading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			void router.push('/auth/login')
		}
	}, [loading, user, router])

	const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [saving, setSaving] = useState(false)
	const [msg, setMsg] = useState<string | null>(null)

	useEffect(() => {
		if (!settings) return
		setSortBy(settings.sortBy || 'name')
		setSortOrder(settings.sortOrder || 'asc')
	}, [settings])

	const handleSave = async () => {
		try {
			setSaving(true)
			await saveSettings({ sortBy, sortOrder })
			setMsg('Settings saved')
		} catch (e) {
			setMsg('Failed to save settings')
		} finally {
			setSaving(false)
			setTimeout(() => setMsg(null), 2500)
		}
	}

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950'>
				<div className='text-lg text-zinc-600 dark:text-zinc-400'>
					Loading...
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
			<header className='bg-white dark:bg-zinc-900 shadow'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
					<h1
						className='text-2xl font-bold'
						style={{ color: 'var(--color-primary)' }}
					>
						Settings
					</h1>
					<div className='flex items-center gap-2'>
						<Button
							variant='ghost'
							onClick={() => router.push('/friends')}
							className='px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300'
						>
							Back
						</Button>
					</div>
				</div>
			</header>

			<main className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{msg && (
					<div className='mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded'>
						{msg}
					</div>
				)}

				<div className='card dark:bg-zinc-900 p-6'>
					<h2
						className='text-xl font-semibold mb-4'
						style={{ color: 'var(--color-primary)' }}
					>
						Global Preferences
					</h2>

					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
								Sort by
							</label>
							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(
										e.target.value as 'name' | 'createdAt'
									)
								}
								className='px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
							>
								<option value='name'>Name</option>
								<option value='createdAt'>Date added</option>
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>
								Sort order
							</label>
							<select
								value={sortOrder}
								onChange={(e) =>
									setSortOrder(
										e.target.value as 'asc' | 'desc'
									)
								}
								className='px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'
							>
								<option value='asc'>Ascending</option>
								<option value='desc'>Descending</option>
							</select>
						</div>

						<div className='flex gap-2'>
							<Button
								onClick={handleSave}
								disabled={saving}
								className='px-4 py-2'
							>
								{saving ? 'Saving...' : 'Save Settings'}
							</Button>
							<Button
								variant='ghost'
								onClick={() => {
									// reset to current settings
									setSortBy(settings?.sortBy || 'name')
									setSortOrder(settings?.sortOrder || 'asc')
								}}
								className='px-4 py-2'
							>
								Reset
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
