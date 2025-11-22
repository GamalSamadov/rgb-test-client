import { api } from './axios'
import type { Deal, DealStatus, CreateDealInput } from '@/types/deal'

export async function fetchDeals(params?: {
	status?: DealStatus
	clientId?: string
}): Promise<Deal[]> {
	const res = await api.get<Deal[]>('/deals', { params })
	return res.data
}

export async function createDeal(payload: CreateDealInput): Promise<Deal> {
	const res = await api.post<Deal>('/deals', payload)
	return res.data
}

export async function updateDeal(
	id: string,
	payload: Partial<CreateDealInput>
): Promise<Deal> {
	const res = await api.patch<Deal>(`/deals/${id}`, payload)
	return res.data
}

export async function deleteDeal(id: string): Promise<void> {
	await api.delete(`/deals/${id}`)
}
