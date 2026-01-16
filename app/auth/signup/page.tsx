'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import Input from '@/components/Input'

export default function SignupPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { signup, signInWithGoogle } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters')
			return
		}

		setLoading(true)

		try {
			await signup(email, password)
			router.push('/friends')
		} catch (err) {
			const error = err as Error
			setError(error.message || 'Failed to create account')
		} finally {
			setLoading(false)
		}
	}

	if (loading) return <Loading />

	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4'>
			<div className='w-full max-w-md space-y-8 card dark:bg-zinc-900 p-8'>
				<div>
					<h2
						className='text-3xl font-bold text-center'
						style={{ color: 'var(--color-primary)' }}
					>
						Create Account
					</h2>
					<p className='mt-2 text-center text-zinc-600 dark:text-zinc-400'>
						Start managing your friends database
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
						autoComplete='new-password'
						required
						label='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<Input
						id='confirmPassword'
						name='confirmPassword'
						type='password'
						autoComplete='new-password'
						required
						label='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>

					<div>
						<Button
							type='submit'
							disabled={loading}
							className='w-full'
						>
							{loading ? 'Creating account...' : 'Create account'}
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
						Already have an account?{' '}
					</span>
					<Link
						href='/auth/login'
						className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	)
}
