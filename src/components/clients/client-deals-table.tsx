import type { Deal } from '@/types/deal'

import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'

interface ClientDealsTableProps {
	deals: Deal[]
}

export function ClientDealsTable({ deals }: ClientDealsTableProps) {
	return (
		<div className='rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm'>
			<div className='border-b border-slate-800 px-4 py-3'>
				<h2 className='text-sm font-medium text-slate-100'>Deals</h2>
			</div>
			<div className='px-4 py-4'>
				{deals.length === 0 ? (
					<p>No deals yet.</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='text-slate-400'>Title</TableHead>
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
									<TableCell>${deal.amount}</TableCell>
									<TableCell>{deal.status}</TableCell>
									<TableCell>
										{new Date(deal.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}
