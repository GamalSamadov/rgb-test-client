'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchClient } from '@/lib/api/clients'
import { queryKeys } from '@/lib/query-keys'
import type { Client } from '@/types/client'

import { Button } from '@/components/ui/button'
import { ClientHeader } from '@/components/clients/client-header'
import { ClientDealsForm } from '@/components/clients/client-deals-form'
import { ClientDealsTable } from '@/components/clients/client-deals-table'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

export default function ClientDetailPage() {
	const params = useParams()
	const router = useRouter()

	const rawId = params?.id
	const id =
		typeof rawId === 'string'
			? rawId
			: Array.isArray(rawId)
			? rawId[0]
			: undefined

	const enabled = !!id

	const {
		data: client,
		isLoading,
		isError,
	} = useQuery<Client>({
		queryKey: enabled ? queryKeys.client(id as string) : ['client', 'unknown'],
		queryFn: () => fetchClient(id as string),
		enabled,
	})

	useKeyboardShortcuts({
		b: () => {
			router.push('/clients')
		},
	})

	if (!id || isLoading) {
		return (
			<div className='min-h-screen bg-slate-950 text-slate-50 p-6'>
				Loading client...
			</div>
		)
	}

	if (isError || !client) {
		return (
			<div className='min-h-screen bg-slate-950 text-slate-50 p-6'>
				<p className='mb-4 text-red-400'>Client not found</p>
				<Button
					onClick={() => router.push('/clients')}
					className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors'
				>
					Back to clients
				</Button>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col gap-6 p-6'>
			<ClientHeader client={client} />
			<ClientDealsForm clientId={id} />
			<ClientDealsTable deals={client.deals ?? []} />
		</div>
	)
}
