// src/lib/api/clients.ts
import { api } from './axios'
import type { Client, CreateClientInput } from '@/types/client'

export interface PaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface PaginatedClientsResponse {
	data: Client[]
	meta: PaginationMeta
}

export async function fetchClients(
	page = 1,
	limit = 10
): Promise<PaginatedClientsResponse> {
	const res = await api.get<PaginatedClientsResponse>('/clients', {
		params: { page, limit },
	})
	return res.data
}

export async function fetchClient(id: string): Promise<Client> {
	const res = await api.get<Client>(`/clients/${id}`)
	return res.data
}

export async function createClient(
	payload: CreateClientInput
): Promise<Client> {
	const res = await api.post<Client>('/clients', payload)
	return res.data
}

export async function updateClient(
	id: string,
	payload: Partial<CreateClientInput>
): Promise<Client> {
	const res = await api.patch<Client>(`/clients/${id}`, payload)
	return res.data
}

export async function deleteClient(id: string): Promise<void> {
	await api.delete(`/clients/${id}`)
}
