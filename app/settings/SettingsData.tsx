'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { friendsService } from '@/lib/friendsService'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsData() {
	const { user } = useAuth()

	const [importPreview, setImportPreview] = useState<any[] | null>(null)
	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState<string | null>(null)

	useEffect(() => {
		if (importError) toast.error(importError)
	}, [importError])

	const handleExport = async () => {
		if (!user) return
		try {
			const data = await friendsService.getFriends(user.uid)
			const blob = new Blob(
				[
					JSON.stringify(
						{
							exportedAt: new Date().toISOString(),
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
	}

	const handleImportPreview = async (e: ChangeEvent<HTMLInputElement>) => {
		setImportError(null)
		setImportPreview(null)
		const input = e.currentTarget as HTMLInputElement
		const f = input.files?.[0]
		if (!f) {
			input.value = ''
			return
		}
		try {
			const text = await f.text()
			const j = JSON.parse(text)
			let items: any[] = []
			if (Array.isArray(j)) items = j
			else if (j.data && Array.isArray(j.data)) items = j.data
			else if (j.items && Array.isArray(j.items)) items = j.items
			else {
				setImportError('JSON does not contain an array of friends')
				return
			}
			const preview = items.filter(Boolean).map((it) => ({
				firstName:
					it.firstName ||
					it.first_name ||
					(it.name ? it.name.split(' ')[0] : ''),
				lastName:
					it.lastName ||
					it.last_name ||
					(it.name ? it.name.split(' ').slice(1).join(' ') : ''),
				email: it.email,
				phone: it.phone,
				birthday: it.birthday,
				notes: it.notes,
				lastSeen: it.lastSeen || it.last_seen,
			}))
			setImportPreview(preview)
		} catch (err) {
			console.error(err)
			setImportError('Failed to parse JSON')
		} finally {
			input.value = ''
		}
	}

	const handleImport = async () => {
		if (!user || !importPreview) return
		setImporting(true)
		try {
			for (const it of importPreview) {
				if (!it.firstName) continue
				await friendsService.addFriend(user.uid, {
					firstName: it.firstName,
					lastName: it.lastName,
					email: it.email,
					phone: it.phone,
					birthday: it.birthday,
					notes: it.notes,
					lastSeen: it.lastSeen,
				})
			}
			setImportPreview(null)
		} catch (err) {
			console.error(err)
			setImportError('Import failed')
		} finally {
			setImporting(false)
		}
	}

	return (
		<>
			<div className='space-y-4'>
				<div className='py-4 flex items-center justify-between'>
					<div>
						<div className='text-sm font-medium'>Data</div>
						<div className='text-sm text-muted-foreground'>
							Export/import your data (JSON).
						</div>
					</div>
					<div className='flex gap-2'>
						<Button
							variant='default'
							onClick={handleExport}
							className='px-4 py-2'
						>
							Export Backup
						</Button>
						<label className='inline-flex items-center px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-sm cursor-pointer'>
							<input
								type='file'
								accept='application/json'
								onChange={handleImportPreview}
								style={{ display: 'none' }}
							/>
							<span>Upload Backup</span>
						</label>
					</div>

					<Dialog
						open={!!importPreview}
						onOpenChange={(open) => {
							if (!open) setImportPreview(null)
						}}
					>
						{importPreview && (
							<DialogContent className='max-h-[80vh] w-full flex flex-col overflow-hidden'>
								<DialogHeader>
									<DialogTitle>Import Preview</DialogTitle>
									<DialogDescription className='mt-1'>
										Preview the first 20 items from the
										uploaded backup.
									</DialogDescription>
								</DialogHeader>
								<div className='mt-2 flex-1 overflow-auto flex flex-col items-center gap-4 px-2'>
									{importPreview.slice(0, 20).map((it, i) => (
										<div
											key={i}
											className='border rounded p-2 text-sm w-full'
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
								<DialogFooter className='mt-4 flex-none border-t pt-3 bg-background'>
									<div className='flex gap-2'>
										<Button
											variant='default'
											onClick={handleImport}
										>
											{importing
												? 'Importing...'
												: 'Import'}
										</Button>
										<Button
											variant='ghost'
											onClick={() =>
												setImportPreview(null)
											}
										>
											Cancel
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						)}
					</Dialog>
				</div>
			</div>
		</>
	)
}
