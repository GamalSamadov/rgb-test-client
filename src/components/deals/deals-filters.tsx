import type { Client } from '@/types/client'

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export type StatusFilter = 'ALL' | 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST'

interface DealsFiltersProps {
	status: StatusFilter
	clientId: string | 'ALL'
	clients: Client[]
	onChangeStatus: (value: StatusFilter) => void
	onChangeClient: (value: string | 'ALL') => void
}

const statusOptions: StatusFilter[] = [
	'ALL',
	'NEW',
	'IN_PROGRESS',
	'WON',
	'LOST',
]

export function DealsFilters({
	status,
	clientId,
	clients,
	onChangeStatus,
	onChangeClient,
}: DealsFiltersProps) {
	return (
		<Card className='border border-slate-800 bg-slate-900/80 text-slate-50 shadow-sm'>
			<CardHeader>
				<CardTitle className='text-sm font-medium text-slate-100'>
					Filters
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-wrap gap-4'>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-slate-300'>Status</span>
					<Select
						value={status}
						onValueChange={(value: StatusFilter) => onChangeStatus(value)}
					>
						<SelectTrigger className='w-40 bg-slate-950 text-slate-50 border border-slate-700'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className='bg-slate-900 text-slate-50 border border-slate-700'>
							{statusOptions.map(s => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='flex items-center gap-2'>
					<span className='text-sm text-slate-300'>Client</span>
					<Select
						value={clientId}
						onValueChange={(value: string) =>
							onChangeClient(value as string | 'ALL')
						}
					>
						<SelectTrigger className='w-56 bg-slate-950 text-slate-50 border border-slate-700'>
							<SelectValue placeholder='All clients' />
						</SelectTrigger>
						<SelectContent className='bg-slate-900 text-slate-50 border border-slate-700'>
							<SelectItem value='ALL'>All clients</SelectItem>
							{clients.map(c => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	)
}
