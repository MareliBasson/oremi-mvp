import Link from 'next/link'
import { Friend } from '@/types/friend'
import {
	timeAgo,
	avatarGradient,
	getInitials,
	getFullName,
	isFriendOverdue,
} from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarBadge } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
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
	const { settings } = useAuth()

	const fullName = getFullName(friend)

	return (
		<Card className='hover:shadow-lg transition-shadow w-full'>
			<CardHeader>
				<div className='flex items-center gap-3'>
					<Avatar className='w-14 h-14 mr-1'>
						<AvatarFallback
							style={{ background: avatarGradient(fullName) }}
							className='w-14 h-14 text-base font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]'
						>
							{getInitials(friend.firstName, friend.lastName)}
						</AvatarFallback>
						{isFriendOverdue(friend, settings ?? undefined) && (
							<AvatarBadge className='bg-red-600 ring-red-200 dark:ring-red-800' />
						)}
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
