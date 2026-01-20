import Link from 'next/link'
import { Friend } from '@/types/friend'
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
	return (
		<Card className='hover:shadow-lg transition-shadow w-full'>
			<CardHeader>
				<CardTitle>{friend.name}</CardTitle>
			</CardHeader>

			<CardContent>
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
