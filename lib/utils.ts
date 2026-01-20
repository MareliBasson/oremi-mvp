import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function timeAgo(iso?: string) {
	if (!iso) return ''
	const date = new Date(iso)
	if (isNaN(date.getTime())) return iso

	const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
	if (seconds < 60) return 'just now'
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
	const days = Math.floor(hours / 24)
	if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
	const weeks = Math.floor(days / 7)
	if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
	const months = Math.floor(days / 30)
	if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
	const years = Math.floor(days / 365)
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

export function initials(firstName?: string, lastName?: string) {
	const f = firstName?.trim() || ''
	const l = lastName?.trim() || ''
	if (!f && !l) return '?'
	if (!l) return f.slice(0, 2).toUpperCase()
	return (f[0] + l[0]).toUpperCase()
}
