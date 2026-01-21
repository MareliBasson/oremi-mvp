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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function SettingsPage() {
	const { loading, user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			void router.push('/auth/login')
		}
	}, [loading, user, router])

	const [importPreview, setImportPreview] = useState<any[] | null>(null)
	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState<string | null>(null)

	useEffect(() => {
		if (importError) {
			toast.error(importError)
		}
	}, [importError])

	if (loading) {
		return (
			<>
				<div className='flex min-h-screen items-center justify-center'>
					<div className='text-lg text-zinc-600 dark:text-zinc-400'>
						Loading...
					</div>
				</div>
			</>
		)
	}

	return (
		<div className='max-w-[680px] min-h-screen w-full mx-auto py-8 px-4'>
			<Card>
				<CardHeader>
					<CardTitle>Global Preferences</CardTitle>
				</CardHeader>

				<CardContent className='p-6'>
					<div className='space-y-4'>
						<div className='flex gap-2'>
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
										const input =
											e.currentTarget as HTMLInputElement
										const f = input.files?.[0]
										if (!f) {
											// clear value so same file can be selected later
											input.value = ''
											return
										}
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
										} finally {
											// clear value so selecting the same file again fires onChange
											input.value = ''
										}
									}}
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
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Import Preview
										</DialogTitle>
										<DialogDescription className='mt-1'>
											Preview the first 20 items from the
											uploaded backup.
										</DialogDescription>
									</DialogHeader>
									<div className='grid grid-cols-2 gap-2 mt-2'>
										{importPreview
											.slice(0, 20)
											.map((it, i) => (
												<div
													key={i}
													className='border rounded p-2 text-sm'
												>
													<div className='font-semibold'>
														{it.firstName}{' '}
														{it.lastName}
													</div>
													<div className='text-xs text-muted-foreground'>
														{it.email || ''}
													</div>
												</div>
											))}
									</div>
									<DialogFooter className='mt-4'>
										<div className='flex gap-2'>
											<Button
												variant='default'
												onClick={async () => {
													if (!user || !importPreview)
														return
													setImporting(true)
													try {
														let success = 0
														for (const it of importPreview) {
															if (!it.firstName)
																continue
															await friendsService.addFriend(
																user.uid,
																{
																	firstName:
																		it.firstName,
																	lastName:
																		it.lastName,
																	email: it.email,
																	phone: it.phone,
																	birthday:
																		it.birthday,
																	notes: it.notes,
																	lastSeen:
																		it.lastSeen,
																}
															)
															success++
														}
														setImportPreview(null)
													} catch (err) {
														console.error(err)
														setImportError(
															'Import failed'
														)
													} finally {
														setImporting(false)
													}
												}}
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
				</CardContent>
			</Card>
		</div>
	)
}
