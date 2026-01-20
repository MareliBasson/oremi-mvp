import Link from 'next/link'
import { Friend } from '@/types/friend'
import { timeAgo, avatarGradient, initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card'

type FriendCardProps = {
	friend: Friend
}

function formatDate(input?: string) {
	if (!input) return ''
	try {
		return new Date(input).toLocaleDateString()
	} catch {
		return input
	}
}

export default function FriendCard({ friend }: FriendCardProps) {
	const fullName = `${friend.firstName}${
		friend.lastName ? ' ' + friend.lastName : ''
	}`.trim()
	return (
		<Card className='hover:shadow-lg transition-shadow w-full'>
			<CardHeader>
				<div className='flex items-center gap-3'>
					<Avatar className='w-20 h-20'>
						<AvatarFallback
							style={{ background: avatarGradient(fullName) }}
							className='w-20 h-20 text-lg'
						>
							{initials(friend.firstName, friend.lastName)}
						</AvatarFallback>
					</Avatar>
					<CardTitle className='!mb-0'>{fullName}</CardTitle>
				</div>
			</CardHeader>

			<CardContent>
				{friend.lastSeen && (
					<p className='text-sm text-muted-foreground mb-1'>
						👀 Last seen {timeAgo(friend.lastSeen)}
					</p>
				)}
				{friend.email && (
					<p className='text-sm text-muted-foreground mb-1'>
						📧 {friend.email}
					</p>
				)}

				{friend.phone && (
					<p className='text-sm text-muted-foreground mb-1'>
						📱 {friend.phone}
					</p>
				)}

				{friend.birthday && (
					<p className='text-sm text-muted-foreground mb-1'>
						🎂 {formatDate(friend.birthday)}
					</p>
				)}

				{friend.notes && (
					<CardDescription className='mt-3 italic'>
						{friend.notes}
					</CardDescription>
				)}
			</CardContent>
		</Card>
	)
}

export function ClickableFriendCard(props: FriendCardProps) {
	const { friend } = props
	return (
		<Link href={`/friends/${friend.id}`} className='block'>
			<FriendCard friend={friend} />
		</Link>
	)
}
