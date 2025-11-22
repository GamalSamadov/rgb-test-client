'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchDeals } from '@/lib/api/deals'
import { fetchClients, type PaginatedClientsResponse } from '@/lib/api/clients'
import { queryKeys } from '@/lib/query-keys'
import type { Deal, DealStatus } from '@/types/deal'
import type { Client } from '@/types/client'

import { DealsHeader } from '@/components/deals/deals-header'
import { DealsFilters } from '@/components/deals/deals-filters'
import { DealsTable } from '@/components/deals/deals-table'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

type StatusFilter = 'ALL' | 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST'

export default function DealsPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const rawStatus = searchParams.get('status') as DealStatus | null
	const status: StatusFilter =
		rawStatus && ['NEW', 'IN_PROGRESS', 'WON', 'LOST'].includes(rawStatus)
			? (rawStatus as DealStatus)
			: 'ALL'

	const clientIdParam = searchParams.get('clientId')
	const clientId: string | 'ALL' = clientIdParam ?? 'ALL'

	const handleStatusChange = (value: StatusFilter) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value === 'ALL') {
			params.delete('status')
		} else {
			params.set('status', value)
		}
		const query = params.toString()
		router.push(query ? `${pathname}?${query}` : pathname)
	}

	const handleClientChange = (value: string | 'ALL') => {
		const params = new URLSearchParams(searchParams.toString())
		if (value === 'ALL') {
			params.delete('clientId')
		} else {
			params.set('clientId', value)
		}
		const query = params.toString()
		router.push(query ? `${pathname}?${query}` : pathname)
	}

	const filters = {
		status: status === 'ALL' ? undefined : (status as DealStatus),
		clientId: clientId === 'ALL' ? undefined : clientId,
	}

	const { data: clientsData } = useQuery<PaginatedClientsResponse>({
		queryKey: queryKeys.clients(1, 100),
		queryFn: () => fetchClients(1, 100),
	})
	const clients: Client[] = clientsData?.data ?? []

	const {
		data: deals = [],
		isLoading,
		isError,
	} = useQuery<Deal[]>({
		queryKey: queryKeys.deals(filters),
		queryFn: () => fetchDeals(filters),
	})

	useKeyboardShortcuts({
		c: () => {
			router.push('/clients')
		},
	})

	return (
		<div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col gap-6 p-6'>
			<DealsHeader />
			<DealsFilters
				status={status}
				clientId={clientId}
				clients={clients}
				onChangeStatus={handleStatusChange}
				onChangeClient={handleClientChange}
			/>
			<DealsTable deals={deals} isLoading={isLoading} isError={isError} />
		</div>
	)
}
