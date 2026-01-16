'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import Input from '@/components/Input'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { login, signInWithGoogle } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await login(email, password)
			router.push('/friends')
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to login')
		} finally {
			setLoading(false)
		}
	}

	if (loading) return <Loading />

	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4'>
			<div className='w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg'>
				<div>
					<h2 className='text-3xl font-bold text-center text-zinc-900 dark:text-white'>
						Sign In
					</h2>
					<p className='mt-2 text-center text-zinc-600 dark:text-zinc-400'>
						Access your friends database
					</p>
				</div>

				{error && (
					<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded'>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-6'>
					<Input
						id='email'
						name='email'
						type='email'
						autoComplete='email'
						required
						label='Email address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						id='password'
						name='password'
						type='password'
						autoComplete='current-password'
						required
						label='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div>
						<Button
							type='submit'
							disabled={loading}
							className='w-full'
						>
							{loading ? 'Signing in...' : 'Sign in'}
						</Button>
					</div>
				</form>

				<div className='mt-4'>
					<Button
						variant='ghost'
						onClick={async () => {
							setError('')
							setLoading(true)
							try {
								await signInWithGoogle()
								router.push('/friends')
							} catch (err) {
								const error = err as Error
								setError(
									error.message || 'Google sign-in failed'
								)
							} finally {
								setLoading(false)
							}
						}}
						className='w-full flex justify-center items-center gap-2'
					>
						Continue with Google
					</Button>
				</div>

				<div className='text-center text-sm'>
					<span className='text-zinc-600 dark:text-zinc-400'>
						Don&apos;t have an account?{' '}
					</span>
					<Link
						href='/auth/signup'
						className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	)
}
