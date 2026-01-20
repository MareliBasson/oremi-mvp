'use client'

import * as React from 'react'
import {
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

type AuthCardProps = {
	title: string
	subtitle?: string
	children?: React.ReactNode
	onGoogleClick?: () => void | Promise<void>
	showGoogle?: boolean
	googleLabel?: string
	footer?: React.ReactNode
}

export default function AuthCard({
	title,
	subtitle,
	children,
	onGoogleClick,
	showGoogle = true,
	googleLabel = 'Continue with Google',
	footer,
}: AuthCardProps) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4'>
			<Card className='w-full max-w-md'>
				<CardContent className='space-y-8 p-8'>
					<div>
						<CardTitle>
							<h2 className='text-3xl font-bold text-center'>
								{title}
							</h2>
						</CardTitle>
						{subtitle ? (
							<CardDescription>
								<p className='mt-2 text-center text-zinc-600 dark:text-zinc-400'>
									{subtitle}
								</p>
							</CardDescription>
						) : null}
					</div>

					<div>{children}</div>

					{showGoogle && (
						<div>
							<Separator className='my-4' />
							<Button
								variant='secondary'
								onClick={onGoogleClick}
								className='w-full flex justify-center items-center gap-2'
							>
								{googleLabel}
							</Button>
						</div>
					)}

					{footer ? (
						<CardFooter className='justify-center'>
							{footer}
						</CardFooter>
					) : null}
				</CardContent>
			</Card>
		</div>
	)
}
