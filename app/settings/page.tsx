'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { friendsService } from '@/lib/friendsService'

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

	const [importPreview, setImportPreview] = useState<any[] | null>(null)
	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState<string | null>(null)

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
			<>
				<div className='flex min-h-screen items-center justify-center'>
					<div className='text-lg text-zinc-600 dark:text-zinc-400'>
						Loading...
					</div>
				</div>

				{importError && (
					<div className='mt-4 mb-2 text-sm text-red-600 dark:text-red-400'>
						{importError}
					</div>
				)}

				{importPreview && (
					<div className='mt-4 card p-4'>
						<p className='mb-2 text-sm'>
							Preview {importPreview?.length} items
						</p>
						<div className='grid grid-cols-2 gap-2'>
							{importPreview?.slice(0, 20).map((it, i) => (
								<div
									key={i}
									className='border rounded p-2 text-sm'
								>
									<div className='font-semibold'>
										{it.firstName} {it.lastName}
									</div>
									<div className='text-xs text-muted-foreground'>
										{it.email || ''}
									</div>
								</div>
							))}
						</div>
						<div className='mt-3 flex gap-2'>
							<Button
								variant='default'
								onClick={async () => {
									if (!user || !importPreview) return
									setImporting(true)
									try {
										let success = 0
										for (const it of importPreview) {
											if (!it.firstName) continue
											await friendsService.addFriend(
												user.uid,
												{
													firstName: it.firstName,
													lastName: it.lastName,
													email: it.email,
													phone: it.phone,
													birthday: it.birthday,
													notes: it.notes,
													lastSeen: it.lastSeen,
												}
											)
											success++
										}
										setMsg(`Imported ${success} items`)
										setImportPreview(null)
									} catch (err) {
										console.error(err)
										setImportError('Import failed')
									} finally {
										setImporting(false)
									}
								}}
							>
								{importing ? 'Importing...' : 'Import'}
							</Button>
							<Button
								variant='ghost'
								onClick={() => setImportPreview(null)}
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</>
		)
	}

	return (
		<div className='max-w-[680px] w-full mx-auto py-8 px-4'>
			<Card>
				<CardHeader>
					<CardTitle>Global Preferences</CardTitle>
				</CardHeader>

				<CardContent className='p-6'>
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
								onClick={async () => {
									if (!user) return
									try {
										const data =
											await friendsService.getFriends(
												user.uid
											)
										const blob = new Blob(
											[
												JSON.stringify(
													{
														exportedAt:
															new Date().toISOString(),
														data,
													},
													null,
													2
												),
											],
											{ type: 'application/json' }
										)
										const url = URL.createObjectURL(blob)
										const a = document.createElement('a')
										a.href = url
										a.download = `oremi-backup-${
											user.uid
										}-${new Date().toISOString()}.json`
										a.click()
										URL.revokeObjectURL(url)
									} catch (e) {
										console.error('Export failed', e)
										alert('Export failed')
									}
								}}
								className='px-4 py-2'
							>
								Export Backup
							</Button>
							<label className='inline-flex items-center px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-sm cursor-pointer'>
								<input
									type='file'
									accept='application/json'
									onChange={async (e) => {
										setImportError(null)
										setImportPreview(null)
										const f = e.target.files?.[0]
										if (!f) return
										try {
											const text = await f.text()
											const j = JSON.parse(text)
											let items: any[] = []
											if (Array.isArray(j)) items = j
											else if (
												j.data &&
												Array.isArray(j.data)
											)
												items = j.data
											else if (
												j.items &&
												Array.isArray(j.items)
											)
												items = j.items
											else {
												setImportError(
													'JSON does not contain an array of friends'
												)
												return
											}
											// Normalize: ensure objects have at least firstName
											const preview = items
												.filter(Boolean)
												.map((it) => ({
													firstName:
														it.firstName ||
														it.first_name ||
														(it.name
															? it.name.split(
																	' '
															  )[0]
															: ''),
													lastName:
														it.lastName ||
														it.last_name ||
														(it.name
															? it.name
																	.split(' ')
																	.slice(1)
																	.join(' ')
															: ''),
													email: it.email,
													phone: it.phone,
													birthday: it.birthday,
													notes: it.notes,
													lastSeen:
														it.lastSeen ||
														it.last_seen,
												}))
											setImportPreview(preview)
										} catch (err) {
											console.error(err)
											setImportError(
												'Failed to parse JSON'
											)
										}
									}}
									style={{ display: 'none' }}
								/>
								<span>Upload Backup</span>
							</label>
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
				</CardContent>
			</Card>
		</div>
	)
}
