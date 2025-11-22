import Link from 'next/link'
import type { Deal } from '@/types/deal'

import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface DealsTableProps {
	deals: Deal[]
	isLoading: boolean
	isError: boolean
}

export function DealsTable({ deals, isLoading, isError }: DealsTableProps) {
	if (isLoading) {
		return (
			<Card className='border border-slate-800 bg-slate-900/80 text-slate-50 shadow-sm'>
				<CardHeader>
					<CardTitle className='text-sm font-medium'>Deals list</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Loading deals...</p>
				</CardContent>
			</Card>
		)
	}

	if (isError) {
		return (
			<Card className='border border-slate-800 bg-slate-900/80 text-slate-50 shadow-sm'>
				<CardHeader>
					<CardTitle className='text-sm font-medium'>Deals list</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-red-400'>Failed to load deals</p>
				</CardContent>
			</Card>
		)
	}

	if (!deals.length) {
		return (
			<Card className='border border-slate-800 bg-slate-900/80 text-slate-50 shadow-sm'>
				<CardHeader>
					<CardTitle className='text-sm font-medium'>Deals list</CardTitle>
				</CardHeader>
				<CardContent>
					<p>No deals found.</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='border border-slate-800 bg-slate-900/80 text-slate-50 shadow-sm'>
			<CardHeader>
				<CardTitle className='text-sm font-medium'>Deals list</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-slate-400'>Title</TableHead>
							<TableHead className='text-slate-400'>Client</TableHead>
							<TableHead className='text-slate-400'>Amount</TableHead>
							<TableHead className='text-slate-400'>Status</TableHead>
							<TableHead className='text-slate-400'>Created</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{deals.map(deal => (
							<TableRow
								key={deal.id}
								className='hover:bg-slate-900/70 transition-colors'
							>
								<TableCell>{deal.title}</TableCell>
								<TableCell>
									<Link
										href={`/clients/${deal.client.id}`}
										className='underline underline-offset-2'
									>
										{deal.client.name}
									</Link>
								</TableCell>
								<TableCell>${deal.amount}</TableCell>
								<TableCell>
									<Badge className='border border-slate-600 bg-slate-950 text-slate-50'>
										{deal.status}
									</Badge>
								</TableCell>
								<TableCell>
									{new Date(deal.createdAt).toLocaleDateString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
