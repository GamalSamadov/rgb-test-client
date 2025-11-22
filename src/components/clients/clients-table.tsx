'use client'

import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteClient } from '@/lib/api/clients'
import type { Client } from '@/types/client'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'

interface ClientsTableProps {
	clients: Client[]
	isLoading: boolean
	isError: boolean
}

export function ClientsTable({
	clients,
	isLoading,
	isError,
}: ClientsTableProps) {
	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: deleteClient,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clients'] })
		},
	})

	if (isLoading) return <p>Loading...</p>
	if (isError) return <p className='text-red-400'>Failed to load clients</p>
	if (!clients.length) return <p>No clients yet.</p>

	return (
		<div className='rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm'>
			<div className='border-b border-slate-800 px-4 py-3'>
				<h2 className='text-sm font-medium text-slate-100'>Client list</h2>
			</div>
			<div className='px-4 py-4'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-slate-400'>Name</TableHead>
							<TableHead className='text-slate-400'>Email</TableHead>
							<TableHead className='text-slate-400'>Phone</TableHead>
							<TableHead className='text-slate-400'>Created</TableHead>
							<TableHead className='text-right text-slate-400'>
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{clients.map(client => (
							<TableRow
								key={client.id}
								className='hover:bg-slate-900/70 transition-colors'
							>
								<TableCell>
									<Link
										href={`/clients/${client.id}`}
										className='underline underline-offset-2'
									>
										{client.name}
									</Link>
								</TableCell>
								<TableCell>{client.email}</TableCell>
								<TableCell>{client.phone ?? '—'}</TableCell>
								<TableCell>
									{new Date(client.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell className='flex justify-end gap-2'>
									<Link href={`/clients/${client.id}`}>
										<Button className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors text-xs px-3 py-1 h-8'>
											View
										</Button>
									</Link>
									<Button
										disabled={deleteMutation.isPending}
										onClick={() => deleteMutation.mutate(client.id)}
										className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors text-xs px-3 py-1 h-8'
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
