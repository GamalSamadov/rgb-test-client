'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchClients, type PaginatedClientsResponse } from '@/lib/api/clients'
import { queryKeys } from '@/lib/query-keys'
import type { Client } from '@/types/client'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { ClientsHeader } from '@/components/clients/clients-header'
import { ClientsCreateForm } from '@/components/clients/clients-create-form'
import { ClientsTable } from '@/components/clients/clients-table'
import { ClientsPagination } from '@/components/clients/clients-pagination'

const PAGE_SIZE = 10

export default function ClientsPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const pageParam = searchParams.get('page')
	const pageNum = Number(pageParam)
	const page = !pageParam || Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum

	const goToPage = useCallback(
		(nextPage: number) => {
			const params = new URLSearchParams(searchParams.toString())
			if (nextPage <= 1) {
				params.delete('page')
			} else {
				params.set('page', String(nextPage))
			}
			const query = params.toString()
			router.push(query ? `${pathname}?${query}` : pathname)
		},
		[router, pathname, searchParams]
	)

	const { data, isLoading, isError } = useQuery({
		queryKey: queryKeys.clients(page, PAGE_SIZE),
		queryFn: () => fetchClients(page, PAGE_SIZE),
		placeholderData: keepPreviousData,
	})

	const clientsData = data as PaginatedClientsResponse | undefined

	const clientsList: Client[] = clientsData?.data ?? []
	const totalPages = clientsData?.meta?.totalPages ?? 1
	const canGoNext = page < totalPages

	useKeyboardShortcuts({
		ArrowRight: () => {
			if (page < totalPages) goToPage(page + 1)
		},
		ArrowLeft: () => {
			if (page > 1) goToPage(page - 1)
		},
		d: () => {
			router.push('/deals')
		},
	})

	return (
		<div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col gap-6 p-6'>
			<ClientsHeader />
			<ClientsCreateForm />
			<ClientsTable
				clients={clientsList}
				isLoading={isLoading}
				isError={isError}
			/>
			<ClientsPagination
				page={page}
				totalPages={totalPages}
				canGoNext={canGoNext}
				onChangePage={goToPage}
			/>
		</div>
	)
}
