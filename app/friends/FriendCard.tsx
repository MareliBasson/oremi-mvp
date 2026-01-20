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
					<Avatar className='w-14 h-14 mr-1'>
						<AvatarFallback
							style={{ background: avatarGradient(fullName) }}
							className='w-14 h-14 text-base font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]'
						>
							{initials(friend.firstName, friend.lastName)}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<CardTitle className='mb-2'>{fullName}</CardTitle>
						{friend.lastSeen ? (
							<CardDescription className='text-sm text-muted-foreground'>
								Last seen {timeAgo(friend.lastSeen)}
							</CardDescription>
						) : null}
					</div>
				</div>
			</CardHeader>
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
