import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Friend } from '@/types/friend'
import type { UserSettings } from './settingsService'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function timeAgo(iso?: string) {
	if (!iso) return ''
	const date = new Date(iso)

	if (isNaN(date.getTime())) return iso

	const now = new Date()

	// compare calendar days (local time) so "Today" works even if <24h
	const dateMidnight = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	).getTime()
	const nowMidnight = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).getTime()
	const dayDiff = Math.round(
		(nowMidnight - dateMidnight) / (24 * 60 * 60 * 1000)
	)
	if (dayDiff === 0) return 'Today'
	if (dayDiff < 7) return `${dayDiff} day${dayDiff === 1 ? '' : 's'} ago`
	const weeks = Math.floor(dayDiff / 7)
	if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
	const months = Math.floor(dayDiff / 30)
	if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
	const years = Math.floor(dayDiff / 365)
	return `${years} year${years === 1 ? '' : 's'} ago`
}

export function avatarGradient(seed?: string) {
	const palettes = [
		['#f97316', '#f43f5e'], // orange -> rose
		['#06b6d4', '#3b82f6'], // teal -> blue
		['#60a5fa', '#7c3aed'], // light-blue -> violet
		['#f59e0b', '#ef4444'], // amber -> red
		['#34d399', '#10b981'], // emerald -> green
		['#a78bfa', '#f472b6'], // purple -> pink
		['#f97316', '#84cc16'], // orange -> lime
	]

	const s = seed || ''
	let h = 0
	for (let i = 0; i < s.length; i++) {
		h = (h << 5) - h + s.charCodeAt(i)
		h |= 0
	}
	const idx = Math.abs(h) % palettes.length
	const [a, b] = palettes[idx]
	return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`
}

export function getInitials(firstName?: string, lastName?: string) {
	const f = firstName?.trim() || ''
	const l = lastName?.trim() || ''
	if (!f && !l) return '?'
	if (!l) return f.slice(0, 2).toUpperCase()
	return (f[0] + l[0]).toUpperCase()
}

export function getFullName(friend?: Pick<Friend, 'firstName' | 'lastName'>) {
	if (!friend) return ''
	return `${friend.firstName}${
		friend.lastName ? ' ' + friend.lastName : ''
	}`.trim()
}

export function isFriendOverdue(friend: Friend, settings?: UserSettings) {
	if (!settings) return false
	if (settings.checkInEnabled === false) return false
	const freq = settings.checkInFrequency
	if (!freq) return false

	const every = (freq as any).every || 1
	let ms = 0
	switch ((freq as any).interval) {
		case 'seconds':
			ms = every * 1000
			break
		case 'days':
			ms = every * 24 * 60 * 60 * 1000
			break
		case 'weeks':
			ms = every * 7 * 24 * 60 * 60 * 1000
			break
		case 'months':
			ms = every * 30 * 24 * 60 * 60 * 1000
			break
		default:
			return false
	}

	if (!friend.lastSeen) return true
	const last = new Date(friend.lastSeen).getTime()
	return last < Date.now() - ms
}
